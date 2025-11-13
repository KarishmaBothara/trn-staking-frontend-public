import { useCallback } from 'react';

import { Box, Stack } from '@mui/material';

import { numericLocalize } from 'common';

import { DepositErrorFields, useDeposit } from '../../shared/providers/DepositProvider';
import { Button, InputField, Typography } from '@futureverse/component-library';
import { DECIMALS } from 'common/types';
import DecimalViewer from 'components/DecimalViewer';
import ExternalLink from 'components/ExternalLink';
import InformationCard from 'components/InformationCard';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useBalancesAll } from 'hooks/useBalancesAll';
import { unscaleBy } from 'utils/polkadotBN';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

const DepositAmount = () => {
  const { amount, handleAmount, clearError, error, handleGetGasToken } = useDeposit();
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const balancesAll = useBalancesAll(futurePassAddress);
  const { assets, selectedAsset } = useAssets();

  const handleMax = useCallback(() => {
    clearError(DepositErrorFields.AMOUNT);
    handleAmount(unscaleBy(balancesAll?.availableBalance ?? 0, DECIMALS).join(''));
  }, [clearError, handleAmount, balancesAll]);

  const handleChangeAmount = useCallback(
    (e: { target: { value: string } }) => {
      clearError(DepositErrorFields.AMOUNT);
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

  return (
    <>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', lg: 'row' }}
        justifyContent={'space-between'}
        gap={6}
      >
        <Stack direction="column" spacing={3}>
          <Typography variant="h5" fontWeight={700}>
            Select amount to stake
          </Typography>
          <ExternalLink
            href="https://docs.therootnetwork.com/intro/learn/features/staking-protocol#staking"
            content="What is staking?"
          />
        </Stack>
        <InformationCard
          heading="Available ROOT Balance"
          information={
            <DecimalViewer
              value={numericLocalize(
                unscaleBy(balancesAll?.availableBalance ?? 0, DECIMALS).join(''),
                {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 6,
                }
              )}
              size="large"
            />
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
              Stake amount
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
    </>
  );
};

export default DepositAmount;
