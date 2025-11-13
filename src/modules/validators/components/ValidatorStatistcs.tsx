import { useMemo } from 'react';

import { Box, Grid, Tooltip, styled } from '@mui/material';

import { numericLocalize } from 'common';

import useValidators from '../../../providers/ValidatorsProvider';
import { Typography } from '@futureverse/component-library';
import { AccountId } from '@polkadot/types/interfaces';
import { DECIMALS } from 'common/types';
import { useCall } from 'hooks/useCall';
import { COMMISSION_BASE } from 'modules/shared/components/ValidatorFilterDrawer/types';
import { unscaleBy } from 'utils/polkadotBN';
import { useTrnApi } from '@futureverse/transact-react';

const StyledGrid = styled(Grid)`
  padding: 32px 0;
`;

const ValidatorStatistics = () => {
  const { trnApi } = useTrnApi();
  const { statisticsInfo } = useValidators();
  const activeValidators = useCall<AccountId[]>(trnApi && trnApi.query.session.validators);
  const totalValidators = useCall(trnApi && trnApi.query.staking.counterForValidators);

  return (
    <>
      <Typography variant="h1" color="primary.main" fontWeight={700}>
        Network Status
      </Typography>
      <Grid container>
        <StyledGrid item xs={12} md={4}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            TOTAL VALIDATORS
          </Typography>
          <Typography variant="h2" color="primary.main" fontWeight={700}>
            {totalValidators?.toString()}
          </Typography>
          <Typography variant="h5" color="primary.main" fontWeight={700}>
            {activeValidators?.length} Active
          </Typography>
        </StyledGrid>

        <StyledGrid item xs={12} md={5} paddingRight={100}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            TOTAL staked
          </Typography>
          <Tooltip
            title={numericLocalize(unscaleBy(statisticsInfo?.totalStake ?? 0, DECIMALS).join(''), {
              maximumFractionDigits: 6,
              minimumFractionDigits: 6,
            })}
            placement="left-start"
          >
            <Box>
              <Typography
                variant="h2"
                color="primary.main"
                fontWeight={700}
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {numericLocalize(unscaleBy(statisticsInfo?.totalStake ?? 0, DECIMALS).join(''), {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </Typography>
            </Box>
          </Tooltip>
          {/*<Typography variant="h5" color="primary.main" fontWeight={700}>*/}
          {/*  {numericLocalize(percentageOfSupply ?? 0)}% of supply*/}
          {/*</Typography>*/}
        </StyledGrid>

        <StyledGrid item xs={12} md={3}>
          <Typography variant="overline" color="text.secondary" fontWeight={700}>
            Average Commission
          </Typography>
          <Typography variant="h2" color="primary.main" fontWeight={700}>
            {numericLocalize(
              ((statisticsInfo?.averageCommission ?? 0) / COMMISSION_BASE).toFixed(6)
            )}
            %
          </Typography>
          <Typography variant="h5" color="primary.main" fontWeight={700}>
            Highest {numericLocalize((statisticsInfo?.highestCommission ?? 0) / COMMISSION_BASE)}%
          </Typography>
        </StyledGrid>
      </Grid>
    </>
  );
};

export default ValidatorStatistics;
