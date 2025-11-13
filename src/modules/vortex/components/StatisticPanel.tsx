import { Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';

import { numericLocalize } from 'common';

import { useRedeem } from '../provider/RedeemProvider';
import { DECIMALS } from 'common/types';
import DecimalViewer from 'components/DecimalViewer';
import Icon from 'components/Icon';
import InformationCard from 'components/InformationCard';
import StakingCycleTimer from 'modules/shared/components/StakingCycleTimer';
import { unscaleBy } from 'utils/polkadotBN';
import { useCall } from 'hooks/useCall';
import { useTrnApi } from '@futureverse/transact-react';
import { bool } from '@polkadot/types-codec';

interface IProps {
  handleRedeem: () => void;
}

const StatisticPanel = ({ handleRedeem }: IProps) => {
  const { vortex, totalSupply } = useRedeem();
  const { trnApi } = useTrnApi();

  const disableRedeem = useCall<bool>(trnApi?.query.vortexDistribution.disableRedeem);
  const enableRedeemVortex = disableRedeem !== undefined ? disableRedeem.isFalse : false;

  return (
    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Grid item container md={12} sx={{ mt: { xs: 2, lg: 12 }, mb: 2 }}>
        <Grid item xs={0} md={8} />
        <Grid item md={4}>
          <StakingCycleTimer />
        </Grid>
      </Grid>
      <Grid
        item
        container
        sm={12}
        direction={{ xs: 'column-reverse', lg: 'row' }}
        gap={{ xs: 6, lg: 0 }}
      >
        <Grid item sm={12} md={8}>
          {vortex == null ? (
            <CircularProgress color="secondary" />
          ) : (
            <InformationCard
              heading="your vortex balance"
              information={
                <DecimalViewer
                  value={numericLocalize(unscaleBy(vortex, DECIMALS).join(''), {
                    maximumFractionDigits: 6,
                    minimumFractionDigits: 6,
                  })}
                  size="large"
                />
              }
              action={
                enableRedeemVortex && (
                  <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
                    <Button
                      size="large"
                      startIcon={<Icon name="add-position" backgroundColor="secondary.dark" />}
                      onClick={handleRedeem}
                    >
                      Redeem Vortex
                    </Button>
                  </Stack>
                )
              }
            />
          )}
        </Grid>
      </Grid>

      <Grid item sm={12} md={4} sx={{ mt: 5 }}>
        <InformationCard
          heading="Vortex circulating supply"
          information={
            <Typography variant="h2" color="primary.main" fontWeight={700}>
              {numericLocalize(unscaleBy(totalSupply, DECIMALS).join(''), {
                maximumFractionDigits: 6,
                minimumFractionDigits: 6,
              })}
            </Typography>
          }
        />
      </Grid>
    </Grid>
  );
};

export default StatisticPanel;
