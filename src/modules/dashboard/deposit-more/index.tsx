import { FC } from 'react';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';

import { DepositMoreStage } from '../type';
import ConfirmationPanel from './ConfirmationPanel';
import DepositAmountPanel from './DepositAmountPanel';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const DepositMoreDrawer: FC<IProps> = ({ open, onClose }) => {
  const { reset, depositMoreStage, setDepositMoreStage } = useDeposit();
  const handleClose = () => {
    reset();
    setDepositMoreStage(DepositMoreStage.AMOUNT);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          Stake more
        </Typography>
      }
      buttonsBar={undefined}
    >
      {depositMoreStage === DepositMoreStage.AMOUNT && <DepositAmountPanel />}
      {depositMoreStage === DepositMoreStage.CONFIRMATION && (
        <ConfirmationPanel onFinish={handleClose} />
      )}
    </Drawer>
  );
};

export default DepositMoreDrawer;
