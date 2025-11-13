import { FC, useCallback } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { numericLocalize } from 'common';

import { Button, InputField, Typography } from '@futureverse/component-library';
import { DECIMALS } from 'common/types';
import DecimalViewer from 'components/DecimalViewer';
import InformationCard from 'components/InformationCard';
import DrawerContent from 'components/Layout/DrawerContent';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import useLedger from 'hooks/useLedger';
import { useDeposit } from 'modules/shared/providers/DepositProvider';
import { StakeErrorFields, useStakePosition } from 'modules/shared/providers/StakeProvider';
import { unscaleBy } from 'utils/polkadotBN';

import { WithdrawStage } from '../type';

const WithdrawAmountPanel: FC = () => {
  const { amount, handleAmount, clearError, error, confirmToRemove } = useStakePosition();
  const { setWithdrawStage, handleGetGasToken } = useDeposit();
  const ledger = useLedger();
  const { assets, selectedAsset } = useAssets();
  const handleMax = useCallback(() => {
    clearError(StakeErrorFields.AMOUNT);
    handleAmount(unscaleBy(ledger?.activePosition ?? 0, DECIMALS).join(''));
  }, [clearError, handleAmount, ledger]);

  const handleChangeAmount = useCallback(
    (e: { target: { value: string } }) => {
      clearError(StakeErrorFields.AMOUNT);
      handleAmount(e.target.value);
    },
    [clearError, handleAmount]
  );

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleGetGasToken(value);
    },
    [handleGetGasToken]
  );

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      await confirmToRemove();
      if (error.amount) return;
      setWithdrawStage(WithdrawStage.CONFIRMATION);
    },
    [confirmToRemove, error?.amount, setWithdrawStage]
  );

  return (
    <DrawerContent
      buttonsBar={
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
          <Button variant="text" onClick={() => setWithdrawStage(WithdrawStage.START)}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!!error.amount || Number(amount) <= 0}
          >
            Confirm amount
          </Button>
        </Box>
      }
    >
      <Box
        display={'flex'}
        flexDirection={{ xs: 'column', lg: 'row' }}
        justifyContent={'space-between'}
        gap={6}
      >
        <Typography variant="h5" fontWeight={700}>
          Select how much you would like to unstake
        </Typography>
        <InformationCard
          heading="Available to unstake"
          information={
            !ledger ? (
              <CircularProgress color="secondary" />
            ) : (
              <DecimalViewer
                value={numericLocalize(unscaleBy(ledger.activePosition, DECIMALS).join(''), {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 6,
                })}
                size="large"
              />
            )
          }
        />
      </Box>

      <Box display={'flex'} flexDirection="row" justifyContent="flex-end">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          py={6}
          gap={2}
          width={{ xs: '100%', lg: '40%' }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
              unstake amount
            </Typography>
            <Button variant="text" onClick={handleMax}>
              MAX
            </Button>
          </Box>
          <InputField
            value={amount}
            placeholder="0 ROOT"
            onChange={handleChangeAmount}
            isNumeric
            error={!!error.amount}
            helperText={error.amount}
            fullWidth
          />
          <Box display="flex" py={1} width={{ xs: '100%', lg: '40%' }}>
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
      </Box>
    </DrawerContent>
  );
};

export default WithdrawAmountPanel;
