import { FC, useCallback } from 'react';

import { Box } from '@mui/material';

import RedemptionAllTokens from '../components/RedemptionAllTokens';
import { useRedeem } from '../provider/RedeemProvider';
import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';

import { RedeemStage } from '../type';

const RedeemTokensPanel: FC = () => {
  const { setStage } = useRedeem();

  const handleDone = useCallback(async () => {
    setStage(RedeemStage.START);
  }, [setStage]);

  return (
    <DrawerContent
      buttonsBar={
        <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
          <Button variant="contained" onClick={handleDone}>
            Done
          </Button>
        </Box>
      }
    >
      <RedemptionAllTokens />
    </DrawerContent>
  );
};

export default RedeemTokensPanel;
