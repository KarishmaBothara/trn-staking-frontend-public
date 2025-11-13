import { useCallback } from 'react';

import { Box } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import DepositAmount from '../components/DepositAmount';
import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';

import { DepositMoreStage } from '../type';

const DepositAmountPanel = () => {
  const { amount, setDepositMoreStage, error, confirmBondMore } = useDeposit();

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      await confirmBondMore();
      setDepositMoreStage(DepositMoreStage.CONFIRMATION);
    },
    [confirmBondMore, setDepositMoreStage]
  );

  return (
    <>
      <DrawerContent
        buttonsBar={
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
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
        <DepositAmount />
      </DrawerContent>
    </>
  );
};

export default DepositAmountPanel;
