import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';
import { useDeposit } from 'modules/shared/providers/DepositProvider';
import { ValidatorsProvider } from 'providers/ValidatorsProvider';

import { ChangeNominationStage, NominationStage } from '../type';
import ChangeNominatorPanel from './ChangeNominatorPanel';
import ConfirmationPanel from './ConfirmationPanel';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ChangeNominatorDrawer = ({ open, onClose }: IProps) => {
  const { changeNominationStage, setChangeNominationStage, reset } = useDeposit();

  const handleClose = () => {
    reset();
    setChangeNominationStage(ChangeNominationStage.NOMINATION);
    onClose();
  };

  return (
    <ValidatorsProvider>
      <Drawer
        open={open}
        onClose={handleClose}
        HeaderContents={
          <Typography variant="h3" fontWeight={700}>
            Change Nominators
          </Typography>
        }
      >
        {changeNominationStage === ChangeNominationStage.NOMINATION && <ChangeNominatorPanel />}
        {changeNominationStage === ChangeNominationStage.CONFIRMATION && (
          <ConfirmationPanel onFinish={handleClose} />
        )}
      </Drawer>
    </ValidatorsProvider>
  );
};

export default ChangeNominatorDrawer;
