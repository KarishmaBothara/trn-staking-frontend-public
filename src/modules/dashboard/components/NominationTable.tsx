import { useMemo, useState } from 'react';

import { Box, Stack } from '@mui/material';

import { numericLocalize } from 'common';

import { Button, Typography } from '@futureverse/component-library';
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
import { useCall } from 'hooks/useCall';
import useNominator from 'hooks/useNominator';
import useStakingStatus from 'hooks/useStakingStatus';
import NominatorFilterDrawer from 'modules/shared/components/NominatorFilterDrawer';
import Actions from 'modules/shared/components/NominatorFilterDrawer/Actions';
import { VALIDATORS_PAGE_SIZE } from 'modules/shared/components/ValidatorFilterDrawer/types';
import { useNomination } from 'providers/NominationProvider';
import { shortenAddr } from 'utils/format-utils';
import { unscaleBy } from 'utils/polkadotBN';

import ChangeNominatorDrawer from '../change-nominator';
import NominationDrawer from '../nomination';
import { useTrnApi } from '@futureverse/transact-react';

import useValidatorRnsNames from 'hooks/useValidatorRnsNames';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

const NominationTable = () => {
  const { trnApi } = useTrnApi();
  const { nominations, filteredNominations, total, page, setPage } = useNomination();
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const nominator = useNominator(futurePassAddress || '');
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const minNominatorBond = useCall(trnApi && trnApi.query.staking.minNominatorBond);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openNomination, setOpenNomination] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const disableNomination = useMemo(() => {
    return !stakingStatus || stakingStatus?.active < Number(minNominatorBond);
  }, [minNominatorBond, stakingStatus]);

  const rnsMapState = useValidatorRnsNames(filteredNominations.map((item) => item.validator));

  return (
    <Stack direction={'column'} spacing={3} sx={{ pt: 8 }}>
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
          Your nominations
        </Typography>
        {nominator ? (
          <Button onClick={() => setOpenDrawer(true)}>Change nominations</Button>
        ) : (
          <Button disabled={disableNomination} onClick={() => setOpenNomination(true)}>
            Start nominating
          </Button>
        )}
      </Stack>

      {total > 0 && rnsMapState ? (
        <>
          <NominatorFilterDrawer>
            <Actions />
          </NominatorFilterDrawer>

          <Table sx={{ width: { xs: '200%', md: '100%' } }}>
            <TableHead>
              <TableRow>
                <TableHeaderCell>validators</TableHeaderCell>
                <TableHeaderCell>status</TableHeaderCell>
                <TableHeaderCell>my stake</TableHeaderCell>
                <TableHeaderCell>number of nominators</TableHeaderCell>
                <TableHeaderCell>total root nominated</TableHeaderCell>
                <TableHeaderCell>validator commission</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {nominations.map((nomination) => (
                <TableRow key={nomination.validator}>
                  <TableDataCell>
                    <Box display="flex" alignItems="flex-start">
                      <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Typography variant="body1">
                          {rnsMapState[nomination.validator] &&
                          rnsMapState[nomination.validator].includes('0x')
                            ? shortenAddr(nomination.validator)
                            : rnsMapState[nomination.validator]}
                        </Typography>
                        <Typography variant="caption">
                          {shortenAddr(nomination.validator)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        '&::before': {
                          content: '" "',
                          width: '8px',
                          height: '8px',
                          bgcolor: nomination.validatorStatus === 'Active' ? '#008936' : '#767676',
                          borderRadius: '50%',
                          display: 'inline-block',
                          mr: 1,
                        },
                      }}
                    >
                      {nomination.validatorStatus}
                    </Typography>
                  </TableDataCell>
                  <TableDataCell>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        '&::before': {
                          content: '" "',
                          width: '8px',
                          height: '8px',
                          bgcolor:
                            nomination.nominationStatus === 'Active and earning'
                              ? '#008936'
                              : '#767676',
                          borderRadius: '50%',
                          display: 'inline-block',
                          mr: 1,
                        },
                      }}
                    >
                      {nomination.nominationStatus}
                    </Typography>
                  </TableDataCell>
                  <TableDataCell>{nomination.nominatorsNumber}</TableDataCell>
                  <TableDataCell>
                    {nomination.nomBalance
                      ? numericLocalize(
                          unscaleBy(nomination.nomBalance?.toString(), DECIMALS).join(''),
                          {
                            maximumFractionDigits: 6,
                            minimumFractionDigits: 6,
                          }
                        )
                      : `-`}
                  </TableDataCell>
                  <TableDataCell>{nomination.commission}</TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            count={Math.ceil(total / VALIDATORS_PAGE_SIZE)}
            page={page}
            onChange={handleChange}
          />

          <ChangeNominatorDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
        </>
      ) : (
        <>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 700 }}>
            You aren’t currently nominating
          </Typography>
          <NominationDrawer open={openNomination} onClose={() => setOpenNomination(false)} />
        </>
      )}
    </Stack>
  );
};

export default NominationTable;
