import { Button, ReverseColorModeProvider, Typography } from '@futureverse/component-library';
import WalletProfileModal, { WalletProfileModalProps } from 'components/WalletProfileModal';
import { Box, CircularProgress, Dialog, Stack, useMediaQuery } from '@mui/material';
import { FuturePassCopyWarningModal } from './FuturePassCopyWarningModal';
import { numericLocalize, truncateAddress, DECIMALS } from 'common';
import useAuthenticationMethod from 'hooks/useAuthenticationMethod';
import MenuCloseSvg from '../../../../assets/svgs/menu-close.svg';
import MenuOpenSvg from '../../../../assets/svgs/menu-open.svg';
import LogoSvg from '../../../../assets/svgs/union.svg';
import { useBalancesAll } from 'hooks/useBalancesAll';
import { useAuth } from '@futureverse/auth-react';
import { useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation';
import { useBoolean } from 'hooks/useBoolean';
import { unscaleBy } from 'utils/polkadotBN';
import appConfig from 'utils/appConfig';
import NavButton from './NavButton';
import * as React from 'react';
import Link from 'next/link';

export const NAV_SCROLL_ID = 'navScrollContainer';

const NavigationBar = () => {
  const pathname = usePathname();
  const { signOut, userSession, isFetchingSession: isLoading } = useAuth();
  const auth = useAuthenticationMethod();
  const futurePassAddress = userSession?.futurepass ?? null;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const truncatedAddress = React.useMemo(
    () => truncateAddress(userSession?.futurepass),
    [userSession?.futurepass]
  );

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState<boolean>(
    (truncatedAddress && truncatedAddress !== '') || isLoading
  );
  const [wasWarningOpenedFromWallet, setWasWarningOpenedFromWallet] = React.useState(false);
  const [futurePassCopyState, setFuturePassCopyState] = React.useState(false);
  const balancesAll = useBalancesAll(futurePassAddress);
  const {
    value: warningDialogOpen,
    setTrue: openWarningDialog,
    setFalse: closeWarningDialog,
  } = useBoolean();

  const walletModalProps: WalletProfileModalProps | undefined = React.useMemo(() => {
    if (!futurePassAddress || !auth) return;

    return {
      auth,
      futurePassAddress: futurePassAddress as `0x${string}`,
      handleClose: () => setIsWalletModalOpen(false),
      handleLogout: signOut,
      profileSettingsBaseUrl:
        appConfig().profileSettingURL || 'https://login.pass.cloud/profile-settings',
      futurePassDidCopy: futurePassCopyState,
      onFuturePassCopyStateChange: setFuturePassCopyState,
    };
  }, [auth, futurePassAddress, signOut, futurePassCopyState]);

  const handleOpenWarningFromWallet = React.useCallback(() => {
    setWasWarningOpenedFromWallet(true);
    openWarningDialog();
  }, [openWarningDialog]);

  const handleCloseWarningDialog = React.useCallback(() => {
    closeWarningDialog();
  }, [closeWarningDialog]);

  const handleToggleMenu = () => setIsMenuOpen((current) => !current);
  const handleToggleWalletModal = () => {
    setIsWalletModalOpen((current) => !current);
  };

  React.useEffect(() => {
    setIsConnecting(() => !(truncatedAddress && truncatedAddress !== '') || isLoading);
  }, [isLoading, truncatedAddress]);

  // Reopen wallet modal when warning closes if it was opened from wallet
  React.useEffect(() => {
    if (!warningDialogOpen && wasWarningOpenedFromWallet) {
      setIsWalletModalOpen(true);
      setWasWarningOpenedFromWallet(false);
    }
  }, [warningDialogOpen, wasWarningOpenedFromWallet]);

  return (
    <>
      <ReverseColorModeProvider>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            backgroundColor: 'primary.dark',
            display: 'flex',
            justifyContent: { sm: 'center', md: 'flex-start' },
            alignItems: 'center',
            px: 3,
            py: 2,
            width: '100%',
            position: 'relative',
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
          }}
        >
          <Box sx={{ width: '15%' }}>
            <Link href="/">
              <LogoSvg />
            </Link>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack display={{ sm: 'none', md: 'flex' }} direction={'row'} spacing={4}>
              <NavButton href="/dashboard" name="Dashboard" selected={pathname === '/dashboard'} />
              <NavButton
                href="/validators"
                name="Validators"
                selected={pathname === '/validators'}
              />
              <NavButton href="/vortex" name="Vortex" selected={pathname === '/vortex'} />
            </Stack>
          </Box>

          <Box>
            {balancesAll ? (
              <Typography variant="body2" fontWeight={500} color="primary.main">
                {numericLocalize(unscaleBy(balancesAll.availableBalance, DECIMALS).join(''), {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 6,
                })}{' '}
                ROOT
              </Typography>
            ) : (
              <CircularProgress color="secondary" />
            )}
          </Box>

          <Box display={{ sm: 'flex', md: 'none' }} onClick={handleToggleMenu}>
            {isMenuOpen ? <MenuCloseSvg /> : <MenuOpenSvg />}
          </Box>

          <Button
            variant="contained"
            onClick={handleToggleWalletModal}
            sx={{
              display: { sm: 'none', md: 'flex' },
            }}
          >
            {isConnecting ? <CircularProgress color="secondary" /> : <>{truncatedAddress}</>}
          </Button>

          <Box
            sx={{
              display: { xs: isMenuOpen ? 'flex' : 'none', md: 'none' },
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              gap: 3,
              backgroundColor: 'primary.dark',
              borderBottomLeftRadius: 26,
              borderBottomRightRadius: 26,
              position: 'absolute',
              top: 80,
              right: 0,
              width: '100%',
              height: '90vh',
              px: 3,
              zIndex: 100,
            }}
          >
            <Link href="/dashboard" onClick={handleToggleMenu}>
              <Typography
                variant="h2"
                fontWeight={700}
                color={pathname === '/dashboard' ? 'primary.main' : 'secondary.main'}
              >
                Dashboard
              </Typography>
            </Link>
            <Link href="/validators" onClick={handleToggleMenu}>
              <Typography
                variant="h2"
                fontWeight={700}
                color={pathname === '/validators' ? 'primary.main' : 'secondary.main'}
              >
                Validators
              </Typography>
            </Link>
            <Link href="/vortex" onClick={handleToggleMenu}>
              <Typography
                variant="h2"
                fontWeight={700}
                color={pathname === '/vortex' ? 'primary.main' : 'secondary.main'}
              >
                Vortex
              </Typography>
            </Link>
            <Button
              variant="outlined"
              onClick={handleToggleWalletModal}
              sx={{
                display: { sm: 'none', md: 'none' },
              }}
            >
              {isConnecting ? <CircularProgress color="secondary" /> : <>{truncatedAddress}</>}
            </Button>
          </Box>

          {walletModalProps && (
            <Dialog
              open={isWalletModalOpen && !warningDialogOpen}
              scroll="body"
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                sx: {
                  display: 'flex',
                  flex: 1,
                  position: { sm: 'initial', md: 'fixed' },
                  top: { sm: 'initial', md: 80 },
                  right: { sm: 'initial', md: 16 },
                  m: { sm: 'initial', md: 0 },
                },
              }}
              fullScreen={fullScreen}
              onClick={walletModalProps.handleClose}
            >
              <WalletProfileModal
                {...walletModalProps}
                onFuturePassCopy={handleOpenWarningFromWallet}
              />
            </Dialog>
          )}
        </Stack>
      </ReverseColorModeProvider>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { sm: 'center', md: 'space-between' },
          alignItems: 'center',
          width: '100%',
          position: 'relative',
        }}
      >
        {futurePassAddress && (
          <FuturePassCopyWarningModal
            onCopy={() => {
              // Copy action handled in wallet modal
            }}
            open={warningDialogOpen}
            address={futurePassAddress}
            handleClose={handleCloseWarningDialog}
          />
        )}
      </Box>
    </>
  );
};

export default NavigationBar;
