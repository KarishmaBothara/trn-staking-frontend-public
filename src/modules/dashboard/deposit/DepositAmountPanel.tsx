import { Box } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import DepositAmount from '../components/DepositAmount';
import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';

import { DepositStage } from '../type';

const DepositAmountPanel = () => {
  const { amount, setStage, error } = useDeposit();

  return (
    <>
      <DrawerContent
        buttonsBar={
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
            <Button
              variant="contained"
              onClick={() => setStage(DepositStage.NOMINATION)}
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
