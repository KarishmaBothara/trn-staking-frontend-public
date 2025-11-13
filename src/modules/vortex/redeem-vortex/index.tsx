import { FC, useCallback } from 'react';

import { useRedeem } from '../provider/RedeemProvider';
import { Typography } from '@futureverse/component-library';
import Drawer from 'components/Drawer';
import StakeProvider, { useStakePosition } from 'modules/shared/providers/StakeProvider';

import { RedeemStage } from '../type';
import ConfirmationPanel from './ConfirmationPanel';
import RedeemPanel from './RedeemPanel';
import RedeemTokensPanel from './RedeemTokensPanel';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const RedeemDrawerInner: FC<IProps> = ({ open = false, onClose }) => {
  const { reset } = useStakePosition();
  const { stage, setStage, refetchHistory } = useRedeem();

  const handleClose = useCallback(() => {
    reset();
    setStage(RedeemStage.START);
    refetchHistory();
    onClose();
  }, [onClose, refetchHistory, reset, setStage]);

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          {stage === RedeemStage.TOKENS ? 'View all tokens' : 'Redeem'}
        </Typography>
      }
    >
      {stage === RedeemStage.START && <RedeemPanel />}
      {stage === RedeemStage.TOKENS && <RedeemTokensPanel />}
      {stage === RedeemStage.CONFIRMATION && <ConfirmationPanel onFinish={handleClose} />}
    </Drawer>
  );
};

const RedeemDrawer: FC<IProps> = (props) => {
  return (
    <StakeProvider>
      <RedeemDrawerInner {...props} />
    </StakeProvider>
  );
};

export default RedeemDrawer;
