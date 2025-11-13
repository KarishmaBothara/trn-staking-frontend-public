import { useState } from 'react';

import { Box } from '@mui/material';

import HistoryTable from './components/HistoryTable';
import StatisticPanel from './components/StatisticPanel';
import RedeemProvider from './provider/RedeemProvider';
import { Content, ExtraContent } from 'components/Layout';
import RootTransactionProvider from 'providers/RootTransactionProvider';

import RedeemDrawer from './redeem-vortex';

const Vortex = () => {
  const [openRedeem, setOpenRedeem] = useState<boolean>(false);

  return (
    <RootTransactionProvider>
      <RedeemProvider>
        <Box>
          <Content>
            <StatisticPanel handleRedeem={() => setOpenRedeem(true)} />
          </Content>

          <ExtraContent>
            <HistoryTable />
          </ExtraContent>
        </Box>

        <RedeemDrawer open={openRedeem} onClose={() => setOpenRedeem(false)} />
      </RedeemProvider>
    </RootTransactionProvider>
  );
};

export default Vortex;
