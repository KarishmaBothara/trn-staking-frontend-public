import { FC } from 'react';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';
import { ValidatorsProvider } from 'providers/ValidatorsProvider';

import { NominationStage } from '../type';
import ConfirmationPanel from './ConfirmationPanel';
import NominationPanel from './NominationPanel';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const NominationDrawerInner: FC<IProps> = ({ open, onClose }) => {
  const { reset, nominationStage } = useDeposit();
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          Nomination
        </Typography>
      }
      buttonsBar={undefined}
    >
      {nominationStage === NominationStage.NOMINATION && <NominationPanel />}
      {nominationStage === NominationStage.CONFIRMATION && (
        <ConfirmationPanel onFinish={handleClose} />
      )}
    </Drawer>
  );
};

const NominationDrawer: FC<IProps> = (props) => {
  return (
    <ValidatorsProvider>
      <NominationDrawerInner {...props} />
    </ValidatorsProvider>
  );
};

export default NominationDrawer;
