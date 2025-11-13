import { useState } from 'react';

import { Box } from '@mui/material';

import NominationTable from './components/NominationTable';
import PendingActions from './components/PendingActions';
import StatisticPanel from './components/StatisticPanel';
import { Content, ExtraContent } from 'components/Layout';
import DepositDrawer from 'modules/dashboard/deposit';
import DepositProvider from 'modules/shared/providers/DepositProvider';
import { NominationProvider } from 'providers/NominationProvider';
import RootTransactionProvider from 'providers/RootTransactionProvider';

import DepositMoreDrawer from './deposit-more';
import WithdrawDrawer from './withdraw';

const Dashboard = () => {
  const [openDeposit, setOpenDeposit] = useState<boolean>(false);
  const [openWithdraw, setOpenWithdraw] = useState<boolean>(false);
  const [openDepositMore, setOpenDepositMore] = useState<boolean>(false);

  return (
    <RootTransactionProvider>
      <NominationProvider>
        <DepositProvider>
          <Box>
            <Content>
              <StatisticPanel
                handleDeposit={() => setOpenDeposit(true)}
                handleDepositMore={() => setOpenDepositMore(true)}
                handleWithdraw={() => setOpenWithdraw(true)}
              />
            </Content>

            <ExtraContent>
              <NominationTable />

              <PendingActions />
            </ExtraContent>
          </Box>
          <WithdrawDrawer open={openWithdraw} onClose={() => setOpenWithdraw(false)} />
          <DepositDrawer open={openDeposit} onClose={() => setOpenDeposit(false)} />
          <DepositMoreDrawer open={openDepositMore} onClose={() => setOpenDepositMore(false)} />
        </DepositProvider>
      </NominationProvider>
    </RootTransactionProvider>
  );
};

export default Dashboard;
