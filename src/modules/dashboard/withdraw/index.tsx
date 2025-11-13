import { FC, useCallback } from 'react';

import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';
import { useDeposit } from 'modules/shared/providers/DepositProvider';
import StakeProvider, { useStakePosition } from 'modules/shared/providers/StakeProvider';

import { WithdrawStage } from '../type';
import ConfirmationPanel from './ConfirmationPanel';
import WithdrawAmountPanel from './WithdrawAmountPanel';
import WithdrawStartPanel from './WithdrawStartPanel';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const WithdrawDrawerInner: FC<IProps> = ({ open = false, onClose }) => {
  const { reset } = useStakePosition();
  const { withdrawStage, setWithdrawStage } = useDeposit();

  const handleClose = useCallback(() => {
    reset();
    setWithdrawStage(WithdrawStage.START);
    onClose();
  }, [onClose, reset, setWithdrawStage]);

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          Unstake
        </Typography>
      }
    >
      {withdrawStage === WithdrawStage.START && <WithdrawStartPanel />}
      {withdrawStage === WithdrawStage.AMOUNT && <WithdrawAmountPanel />}
      {withdrawStage === WithdrawStage.CONFIRMATION && <ConfirmationPanel onFinish={handleClose} />}
    </Drawer>
  );
};

const WithdrawDrawer: FC<IProps> = (props) => {
  return (
    <StakeProvider>
      <WithdrawDrawerInner {...props} />
    </StakeProvider>
  );
};

export default WithdrawDrawer;
