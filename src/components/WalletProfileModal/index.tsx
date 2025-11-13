import { Avatar, Button, IconButton, Typography, Skeleton, Box, Tooltip } from '@mui/material';
import useWalletAccountInfo, { WalletAccountInfo } from '../../hooks/useWalletAccountInfo';
import { ReactComponent as FPassLight } from '../../../assets/svgs/FPassLight.svg';
import { useAccounts } from '@futureverse/asset-register-react/profiles';
import { UserAuthenticationMethod, hush } from 'common';
import { useAuth } from '@futureverse/auth-react';
import { truncateAddress } from 'common/utils';
import CopyButton from '../CopyButton';
import * as React from 'react';
import * as t from 'io-ts';

const POLLING_INTERVAL = 10000;

const SelectedProfile = t.type({
  id: t.string,
  owner: t.string,
  profileId: t.string,
  displayName: t.string,
  avatar: t.UnknownRecord,
});

const UserProfile = t.type({
  accountId: t.string,
  handle: t.string,
  address: t.string,
  selectedProfile: SelectedProfile,
});

export type WalletProfileModalProps = {
  futurePassAddress: `0x${string}`;
  auth: UserAuthenticationMethod;
  handleClose: () => void;
  handleLogout: () => void;
  didCopy?: boolean;
  onFuturePassCopy?: () => void;
  profileSettingsBaseUrl: string;
  futurePassDidCopy?: boolean;
  onFuturePassCopyStateChange?: (didCopy: boolean) => void;
};

export type AccountInfo = WalletAccountInfo;

function WalletProfileModal({
  futurePassAddress,
  auth,
  handleClose,
  handleLogout,
  didCopy,
  onFuturePassCopy,
  profileSettingsBaseUrl,
  futurePassDidCopy,
  onFuturePassCopyStateChange,
}: WalletProfileModalProps): JSX.Element {
  const { userSession } = useAuth();
  const [isPolling, setIsPolling] = React.useState(false);
  const { accounts, reactQuery } = useAccounts({
    addresses: [futurePassAddress],
  });

  const { account, profile } = React.useMemo(() => {
    const profileDecodeResult = UserProfile.decode(userSession?.user?.profile.profile);

    const decodedProfile = hush(profileDecodeResult);

    const matchedAccount = accounts?.find((x) => x.id === decodedProfile?.accountId);

    const matchedProfile = matchedAccount?.profiles?.find(
      (x) => x.profileId === decodedProfile?.selectedProfile.profileId
    );

    return {
      account: matchedAccount,
      profile: matchedProfile,
    };
  }, [userSession, accounts]);

  const openSettings = React.useCallback(() => {
    if (!userSession?.user) return;

    setIsPolling(true);
    const settingsUrl = `${profileSettingsBaseUrl}?accessToken=${userSession.user.access_token}`;
    window.open(settingsUrl, '_blank');
  }, [userSession, profileSettingsBaseUrl]);

  // Polling logic using React Query's refetch
  React.useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      void reactQuery.refetch();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [isPolling, reactQuery]);

  const accountInfo = useWalletAccountInfo(auth);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
        minWidth: '258px',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '8px',
        backgroundColor: 'white',
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 2,
          }}
        >
          {/* FuturePass Logo */}
          <Box
            sx={{
              width: '93px',
              minWidth: '93px',
              display: 'flex',
              alignItems: 'center',
              '& > svg': {
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
              },
            }}
          >
            <FPassLight width={93} height="auto" viewBox="0 0 181 63" />
          </Box>

          {/* Close Button */}
          <IconButton aria-label="Close" onClick={handleClose}>
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '24px',
                color: '#666',
                fontSize: '24px',
                justifyContent: 'center',
              }}
              data-testid="icon-font-close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ width: '100%', height: '100%' }}
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </Box>
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            alt="profile Image"
            src={profile?.avatar.asset?.metadata?.properties?.image ?? ''}
          />
          <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', overflow: 'hidden' }}>
            {reactQuery.isLoading ? (
              <>
                <Skeleton variant="text" width={100} />
                <Skeleton variant="text" width={100} />
              </>
            ) : (
              <>
                <Tooltip title={profile?.displayName ?? ''} placement="top">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      display: 'block',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {profile?.displayName}
                  </Typography>
                </Tooltip>
                <Tooltip title={`@${account?.handle}`} placement="top">
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight="bold"
                    sx={{
                      display: 'block',
                      width: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    @{account?.handle}
                  </Typography>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="overline" color="textSecondary">
            Your futurepass address
          </Typography>
          <CopyButton
            didCopy={futurePassDidCopy || didCopy}
            value={futurePassAddress}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            onlyIconChange
            showTooltip={false}
            onBypass={() => {
              onFuturePassCopy?.();
              onFuturePassCopyStateChange?.(true);
            }}
          >
            <Typography variant="body1" color="textPrimary" sx={{ overflow: 'hidden' }}>
              {truncateAddress(futurePassAddress)}
            </Typography>
          </CopyButton>
        </Box>
        {accountInfo != null && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="overline" color="textSecondary">
              {`Signed in with ${accountInfo.title}`}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                width: 'fit-content',
                alignItems: 'center',
                gap: 1,
                borderRadius: '16px',
                border: '1px solid #F7F7F7',
                py: 1,
                px: 2,
              }}
            >
              {accountInfo.icon}
              {accountInfo.copiable ? (
                <CopyButton
                  value={accountInfo.value}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  onlyIconChange
                  showTooltip={false}
                >
                  <Typography variant="caption" fontWeight={700} sx={{ overflow: 'hidden' }}>
                    {accountInfo.shouldTruncateValue
                      ? truncateAddress(accountInfo.value)
                      : accountInfo.value}
                  </Typography>
                </CopyButton>
              ) : (
                <Typography
                  sx={{
                    maxWidth: '100%',
                    overflow: 'hidden',
                    wordBreak: 'break-word',
                  }}
                  variant="caption"
                  fontWeight={700}
                >
                  {accountInfo.shouldTruncateValue
                    ? truncateAddress(accountInfo.value)
                    : accountInfo.value}
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={openSettings}
          color="secondary"
          startIcon={<span className="material-symbols-outlined">{'settings'}</span>}
        >
          Settings
        </Button>
        <Button
          variant="outlined"
          onClick={handleLogout}
          color="error"
          startIcon={<span className="material-symbols-outlined">{'logout'}</span>}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default WalletProfileModal;
