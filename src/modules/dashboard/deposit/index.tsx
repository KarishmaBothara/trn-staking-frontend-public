import { FC } from 'react';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';

import { DepositStage } from '../type';
import AttentionPanel from './AttentionPanel';
import ConfirmationPanel from './ConfirmationPanel';
import DepositAmountPanel from './DepositAmountPanel';
import Nomination from './Nomination';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const DepositDrawer: FC<IProps> = ({ open, onClose }) => {
  const { stage, setStage, reset } = useDeposit();

  const handleClose = () => {
    reset();
    setStage(DepositStage.AMOUNT);
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          Stake
        </Typography>
      }
      buttonsBar={undefined}
    >
      {stage === DepositStage.AMOUNT && <DepositAmountPanel />}
      {stage === DepositStage.NOMINATION && <Nomination />}
      {stage === DepositStage.ATTENTION && <AttentionPanel />}
      {stage === DepositStage.CONFIRMATION && <ConfirmationPanel onFinish={handleClose} />}
    </Drawer>
  );
};

export default DepositDrawer;
