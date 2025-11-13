import { FC, useCallback } from 'react';

import { Box, CircularProgress, Grid } from '@mui/material';

import { numericLocalize } from 'common';

import RedemptionPreview from '../components/RedemptionPreview';
import { RedeemErrorFields, useRedeem } from '../provider/RedeemProvider';
import { Button, InputField, Typography } from '@futureverse/component-library';
import { DECIMALS } from 'common/types';
import DecimalViewer from 'components/DecimalViewer';
import InformationCard from 'components/InformationCard';
import DrawerContent from 'components/Layout/DrawerContent';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { scaleBy, unscaleBy } from 'utils/polkadotBN';

import { RedeemStage } from '../type';

const RedeemPanel: FC = () => {
  const { setStage, amount, handleAmount, clearError, error, handleGetGasToken } = useRedeem();

  const { confirmRedeem } = useRootTransaction();

  const { vortex } = useRedeem();

  const { assets, selectedAsset } = useAssets();

  const handleMax = useCallback(() => {
    clearError(RedeemErrorFields.AMOUNT);
    handleAmount(unscaleBy(vortex ?? 0, DECIMALS).join(''));
  }, [clearError, handleAmount, vortex]);

  const handleChangeAmount = useCallback(
    (e: { target: { value: string } }) => {
      clearError(RedeemErrorFields.AMOUNT);
      handleAmount(e.target.value);
    },
    [clearError, handleAmount]
  );

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      await confirmRedeem(scaleBy(amount, DECIMALS));
      if (error.amount) return;
      setStage(RedeemStage.CONFIRMATION);
    },
    [amount, confirmRedeem, error.amount, setStage]
  );

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleGetGasToken(value);
    },
    [handleGetGasToken]
  );

  return (
    <DrawerContent
      buttonsBar={
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!!error.amount || Number(amount) <= 0}
          >
            Confirm
          </Button>
        </Box>
      }
    >
      <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
        <Grid
          item
          xs={7}
          display={'flex'}
          flexDirection="column"
          justifyContent={'space-between'}
          gap={6}
        >
          {!vortex ? (
            <CircularProgress color="secondary" />
          ) : (
            <InformationCard
              heading="AVAILABLE VORTEX BALANCE"
              information={
                <DecimalViewer
                  value={numericLocalize(unscaleBy(vortex, DECIMALS).join(''), {
                    maximumFractionDigits: 6,
                    minimumFractionDigits: 6,
                  })}
                  size="large"
                />
              }
            />
          )}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            py={6}
            gap={2}
            width="60%"
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems={'center'}
            >
              <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                Redeem amount
              </Typography>
              <Button variant="text" onClick={handleMax}>
                MAX
              </Button>
            </Box>
            <InputField
              value={amount}
              placeholder="0 Vortex"
              onChange={handleChangeAmount}
              error={!!error.amount}
              helperText={error.amount}
              fullWidth
            />
          </Box>
        </Grid>

        <Grid item xs={5}>
          <RedemptionPreview />
          <Box mt={2}>
            <Box display="flex" py={3} width={{ xs: '100%', lg: '40%' }}>
              <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                GAS PAYMENT
              </Typography>
            </Box>
            <Select
              label="GAS PAYMENT"
              defaultGas={selectedAsset}
              menuItems={assets}
              onChange={handleGasPayment}
              ariaLabel="Select gas payment"
              sx={{
                backgroundColor: '#000',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#FFF',
                  color: '#000',
                  outline: 'none',
                  borderRadius: '.2rem',
                  '&.MuiInputBase-root > .MuiSelect-icon': {
                    color: '#000',
                  },
                },
                '&.Mui-focused': {
                  border: 'none',
                },
                '&.MuiInputBase-root': {
                  border: '1px solid #424242',
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </DrawerContent>
  );
};

export default RedeemPanel;
