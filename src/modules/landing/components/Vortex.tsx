import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Box, Grid } from '@mui/material';
import { Button, Typography } from '@futureverse/component-library';
import Icon from 'components/Icon';
import { fetchVortexRanking } from 'utils/fetchRequest';
import AllTokenDrawer from './AllTokenDrawer';
import VortexInfo, { VortexInfoProps } from './VortexInfo';

const DefaultVortexList: VortexInfoProps[] = [
  {
    token: 'XRP',
    percentage: '0.000',
    amount: '0.000',
    cycle: '0.000',
  },
  {
    token: 'ROOT',
    percentage: '0.000',
    amount: '0.000',
    cycle: '0.000',
  },
  {
    token: 'SYLO',
    percentage: '0.000',
    amount: '0.000',
    cycle: '0.000',
  },
  {
    token: 'ASTO',
    percentage: '0.000',
    amount: '0.000',
    cycle: '0.000',
  },
];

const Vortex = () => {
  const [openAllTokenDrawer, setOpenAllTokenDrawer] = useState(false);

  const { data: rankingData, isLoading } = useQuery({
    queryKey: ['vortex-ranking'],
    queryFn: async () => {
      return await fetchVortexRanking();
    },
  });

  const vortexData = useMemo(() => {
    if (rankingData?.response) {
      const vortexList = DefaultVortexList.map((vortex) => {
        const gecko = rankingData.response.find((d: any) => {
          const key = d?.[0];
          if (vortex.token.toLowerCase() === key.toLowerCase()) {
            return true;
          }
        });
        if (gecko?.[1]) {
          const { added_this_cycle, amount, percentage } = gecko[1];
          return {
            token: vortex.token,
            amount,
            percentage,
            cycle: added_this_cycle,
          };
        } else {
          return vortex;
        }
      });
      return vortexList;
    }
    return DefaultVortexList;
  }, [rankingData]);

  return (
    <Box sx={{ height: '100%', backgroundColor: 'primary.main', p: { xs: 0, lg: 2 } }}>
      <Grid
        container
        sx={{
          height: '100%',
          backgroundColor: 'primary.dark',
          borderRadius: '26px',
          px: { xs: 2, lg: 7 },
          py: 6,
        }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 4,
            pb: { xs: 5, lg: 0 },
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            The Vortex
          </Typography>
          <Link href="/dashboard">
            <Button
              variant="contained"
              startIcon={<Icon name="remove-position" backgroundColor="primary.dark" />}
              size="large"
            >
              Start Staking
            </Button>
          </Link>
        </Grid>
        <Grid item container xs={12} md={8}>
          {vortexData.map((item, index) => (
            <Grid item xs={12} lg={6} key={index}>
              <VortexInfo {...item} />
            </Grid>
          ))}
          <Grid item md={8}>
            <Button
              variant="text"
              startIcon={<Icon name="external-link" backgroundColor="primary.dark" />}
              size="large"
              disabled={isLoading || rankingData?.response?.length === 0 || !!rankingData?.error}
              onClick={() => setOpenAllTokenDrawer(true)}
            >
              View all tokens
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {!isLoading && rankingData?.response && (
        <AllTokenDrawer
          open={openAllTokenDrawer}
          onClose={() => setOpenAllTokenDrawer(false)}
          geckoData={rankingData}
        />
      )}
    </Box>
  );
};

export default Vortex;
