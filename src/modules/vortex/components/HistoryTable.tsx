import { Box, Stack, Link } from '@mui/material';
import InfoOutLinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import { numericLocalize } from 'common';

import appConfig from 'utils/appConfig';

import { useRedeem } from '../provider/RedeemProvider';
import { Typography } from '@futureverse/component-library';
import { DECIMALS } from 'common/types';
import Pagination from 'components/Pagination';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'components/Table';
import { PAGE_SIZE } from 'utils/fetchRequest';
import { unscaleBy } from 'utils/polkadotBN';

const HistoryTable = () => {
  const {
    rewardRedeemHistory,
    rewardRedeemHistoryLoading,
    rewardRedeemHistoryError,
    total,
    page,
    setPage,
  } = useRedeem();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Stack direction={'column'} spacing={3} sx={{ pt: 8 }}>
      <>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
          Your history
          <Tooltip
            placement="top-start"
            title={
              <Typography variant="subtitle1" fontSize={15}>
                The Vortex amounts displayed below come from the Vortex Distribution and Vortex
                Redemption Events on chain. If you have Vortex from buying, selling, or trading,
                these amounts will not appear in the table below.
              </Typography>
            }
            arrow
          >
            <InfoOutLinedIcon sx={{ marginLeft: 1 }} />
          </Tooltip>
        </Typography>
      </>
      {rewardRedeemHistoryError ? (
        <Typography variant="body1" color="primary.main" sx={{ fontWeight: 700 }}>
          Could not retrieve Vortex history
        </Typography>
      ) : rewardRedeemHistoryLoading ? (
        <Typography variant="body1" color="primary.main" sx={{ fontWeight: 700 }}>
          Vortex history loading
        </Typography>
      ) : total > 0 ? (
        <>
          <Table sx={{ width: { xs: '200%', md: '100%' } }}>
            <TableHead>
              <TableRow>
                <TableHeaderCell>date</TableHeaderCell>
                <TableHeaderCell
                  icon={
                    <Tooltip
                      placement="top"
                      title={
                        <Typography variant="subtitle1" fontSize={15}>
                          The number below is the 90-Day Reward Cycle. The Vortex Distro ID is the
                          on-chain identifier and equals this number minus one.
                        </Typography>
                      }
                      arrow
                    >
                      <InfoOutLinedIcon sx={{ fontSize: 18 }} />
                    </Tooltip>
                  }
                >
                  cycle
                </TableHeaderCell>
                <TableHeaderCell>type</TableHeaderCell>
                <TableHeaderCell>amount</TableHeaderCell>
                <TableHeaderCell>block</TableHeaderCell>
                {/* <TableHeaderCell>vortex balance</TableHeaderCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {rewardRedeemHistory.map(
                ({ blockNumber, timestamp, type, amount, cycleId }, index) => (
                  <TableRow key={index}>
                    <TableDataCell>
                      <Box display="flex" alignItems="flex-start">
                        <Box display="flex" flexDirection="column" alignItems="flex-start">
                          <Typography variant="body1">
                            {new Date(Number(timestamp)).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                      </Box>
                    </TableDataCell>
                    <TableDataCell>
                      {cycleId && type === 'Reward' ? (
                        <>
                          <Typography variant="subtitle1" sx={{ fontWeight: '700' }}>
                            {cycleId}
                          </Typography>
                          {/* Display the Vortex Distribution ID, this is the ID for the reward cycle on chain
                           ** and is equal to nextVortexId - 1. Show both Cycle ID and Vortex Distribution ID to clarify their relationship.
                           */}
                          <Typography
                            variant="caption"
                            sx={{ marginLeft: 1 }}
                          >{`(Vortex Distro ID ${Number(cycleId) - 1})`}</Typography>
                        </>
                      ) : null}
                    </TableDataCell>
                    <TableDataCell>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {type}
                      </Typography>
                    </TableDataCell>
                    {amount ? (
                      <TableDataCell>
                        {numericLocalize(unscaleBy(amount, DECIMALS).join(''), {
                          maximumFractionDigits: 6,
                          minimumFractionDigits: 6,
                        })}
                      </TableDataCell>
                    ) : (
                      <TableDataCell>
                        <Typography variant="body1">Error retrieving amount</Typography>
                      </TableDataCell>
                    )}
                    <TableDataCell>
                      <Typography variant="body1">
                        <Link
                          href={`${appConfig().chain.explorer}/block/${blockNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="inherit"
                          underline="none"
                          sx={{ fontSize: 'inherit', fontWeight: 700 }}
                        >{`${blockNumber}`}</Link>
                      </Typography>
                    </TableDataCell>
                    {/* <TableDataCell>{numericLocalize(unscaleBy(balance, 0).join(''))}</TableDataCell> */}
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>

          <Pagination count={Math.ceil(total / PAGE_SIZE)} page={page} onChange={handleChange} />
        </>
      ) : (
        <>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 700 }}>
            You don't have any Vortex transaction history
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default HistoryTable;
