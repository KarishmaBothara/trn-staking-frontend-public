import { FC, useCallback } from 'react';

import { Box, FormHelperText, Stack, Typography } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import SelectValidators from '../components/SelectValidators';
import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { ValidatorsProvider } from 'providers/ValidatorsProvider';

import { DepositStage } from '../type';

const NominationInner = () => {
  const { clearSelection, setStage, selectedValidators, error } = useDeposit();
  const { assets, selectedAsset } = useAssets();
  const { handleSetGasToken, gasToken } = useRootTransaction();

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleSetGasToken(value);
    },
    [handleSetGasToken]
  );
  return (
    <DrawerContent
      buttonsBar={
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={2}>
          <Button variant="text" onClick={() => setStage(DepositStage.AMOUNT)}>
            Back
          </Button>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
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
                  '&.MuiInputBase-root > .MuiSelect-icon': {
                    color: '#000',
                  },
                },
                '&.Mui-focused': {
                  border: 'none',
                },
                '&.MuiInputBase-root': {
                  border: '1px solid #FFF',
                },
                width: '10rem',
                height: '2.55rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginRight: '1rem',
                borderRadius: '3rem',
              }}
            />
            <Box sx={{ paddingLeft: 3 }}>
              <FormHelperText sx={{ color: 'white' }}>GAS PAYMENT</FormHelperText>
            </Box>
          </Box>
          <Button
            variant="outlined"
            onClick={() => {
              clearSelection();
              setStage(DepositStage.ATTENTION);
            }}
          >
            Skip nomination
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={selectedValidators.length <= 0}
            onClick={() => setStage(DepositStage.ATTENTION)}
          >
            Confirm selection
          </Button>
        </Stack>
      }
    >
      <SelectValidators />
    </DrawerContent>
  );
};

const Nomination: FC = () => {
  return (
    <ValidatorsProvider>
      <NominationInner />
    </ValidatorsProvider>
  );
};

export default Nomination;
