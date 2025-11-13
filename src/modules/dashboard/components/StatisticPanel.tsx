import { Button, CircularProgress, Grid, Stack } from '@mui/material';

import { numericLocalize } from 'common';

import { DECIMALS } from 'common/types';
import DecimalViewer from 'components/DecimalViewer';
import Icon from 'components/Icon';
import InformationCard from 'components/InformationCard';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import useLedger from 'hooks/useLedger';
import useStakingStatus from 'hooks/useStakingStatus';
import StakingCycleTimer from 'modules/shared/components/StakingCycleTimer';
import { unscaleBy } from 'utils/polkadotBN';

interface IProps {
  handleDeposit: () => void;
  handleDepositMore: () => void;
  handleWithdraw: () => void;
}

const StatisticPanel = ({ handleDeposit, handleDepositMore, handleWithdraw }: IProps) => {
  const ledger = useLedger();
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const stakingStatus = useStakingStatus(futurePassAddress || '');

  return (
    <Grid container gap={4} sx={{ alignItems: 'flex-start' }}>
      <Grid item container md={12} sx={{ mt: { xs: 2, lg: 12 } }}>
        <Grid item xs={0} md={8} />
        <Grid item md={4}>
          <StakingCycleTimer />
        </Grid>
      </Grid>
      <Grid item sm={12} gap={{ xs: 6, lg: 0 }}>
        <InformationCard
          heading="staked root"
          information={
            ledger == null ? (
              <CircularProgress color="secondary" />
            ) : (
              <DecimalViewer
                value={numericLocalize(unscaleBy(ledger.totalPosition, DECIMALS).join(''), {
                  maximumFractionDigits: 6,
                  minimumFractionDigits: 6,
                })}
                size="large"
              />
            )
          }
          action={
            <Stack direction="column" spacing={4}>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                <Button
                  size="large"
                  startIcon={<Icon name="add-position" backgroundColor="secondary.dark" />}
                  onClick={
                    !stakingStatus || stakingStatus?.active <= 0 ? handleDeposit : handleDepositMore
                  }
                >
                  Stake ROOT
                </Button>
                <Button
                  variant="outlined"
                  disabled={!ledger}
                  startIcon={<Icon name="remove-position" />}
                  size="large"
                  onClick={() => handleWithdraw()}
                >
                  Unstake
                </Button>
              </Stack>
            </Stack>
          }
        />
      </Grid>
      {/*<Grid item container sm={12} py={4} gap={{ xs: 6, md: 0 }}>*/}
      {/*  <Grid item xs={12} lg={4}>*/}
      {/*    <InformationCard*/}
      {/*      heading="share of staking rewards"*/}
      {/*      information={*/}
      {/*        <Typography variant="h2" color="primary.main" fontWeight={700}>*/}
      {/*          {numericLocalize(share)}%*/}
      {/*        </Typography>*/}
      {/*      }*/}
      {/*      hintText="Your share of staking rewards is based on your staked ROOT relative to the total staked by all participants. Updates at the end of each era."*/}
      {/*      showHint={true}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={12} lg={4}>*/}
      {/*    <InformationCard*/}
      {/*      heading="share of work points rewards"*/}
      {/*      information={*/}
      {/*        <Typography variant="h2" color="primary.main" fontWeight={700}>*/}
      {/*          {numericLocalize(workPointsShare)}%*/}
      {/*        </Typography>*/}
      {/*      }*/}
      {/*      hintText="Your share of Work point rewards compared to total Work points by all participants. Updates at the end of each era."*/}
      {/*      showHint={true}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*  <Grid item xs={12} lg={4}>*/}
      {/*    <InformationCard*/}
      {/*      heading="bootstrap rewards"*/}
      {/*      information={*/}
      {/*        <Typography variant="h2" color="primary.main" fontWeight={700}>*/}
      {/*          {numericLocalize(unscaleBy(totalReward ?? 0, DECIMALS).join(''), {*/}
      {/*            maximumFractionDigits: 6,*/}
      {/*            minimumFractionDigits: 6,*/}
      {/*          })}*/}
      {/*        </Typography>*/}
      {/*      }*/}
      {/*      hintText="Your share of Bootstrap rewards based on your participation level & staked ROOT. Updates at the end of each era."*/}
      {/*      showHint={true}*/}
      {/*    />*/}
      {/*  </Grid>*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default StatisticPanel;
