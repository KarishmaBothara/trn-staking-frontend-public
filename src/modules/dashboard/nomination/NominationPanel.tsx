import { useCallback, useEffect } from 'react';

import { Stack } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import SelectValidators from '../components/SelectValidators';
import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useRootTransaction } from 'providers/RootTransactionProvider';

import { NominationStage } from '../type';

const NominationPanel = () => {
  const { setNominationStage, selectedValidators, confirmNominate } = useDeposit();
  const { handleSetGasToken, gasToken } = useRootTransaction();
  const { assets, selectedAsset } = useAssets();

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      await confirmNominate();
      setNominationStage(NominationStage.CONFIRMATION);
    },
    [confirmNominate, setNominationStage]
  );

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleSetGasToken(value);
    },
    [handleSetGasToken]
  );

  return (
    <>
      <DrawerContent
        buttonsBar={
          <Stack direction={'row'} justifyContent={'flex-end'} spacing={2}>
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
                height: '2.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginRight: '1rem',
                borderRadius: '3rem',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              disabled={selectedValidators.length <= 0}
              onClick={handleConfirm}
            >
              Confirm selection
            </Button>
          </Stack>
        }
      >
        <SelectValidators />
      </DrawerContent>
    </>
  );
};

export default NominationPanel;
