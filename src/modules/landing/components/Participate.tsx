import Link from 'next/link';

import { Box, Divider, Grid } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import ExternalLink from 'components/ExternalLink';

const Participate = () => {
  return (
    <Box sx={{ height: '100%', backgroundColor: 'primary.dark', p: { xs: 2, lg: 9 } }}>
      <Divider sx={{ mb: 1 }} />
      <Typography variant="overline" fontWeight={700}>
        How can you participate?
      </Typography>
      <Grid container height={167} sx={{ mt: 10, mb: 6 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography variant="h1" fontWeight={700} sx={{ lineHeight: '35px', pb: 1 }}>
            Stake
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3 }}
        >
          <Typography variant="subtitle1" fontWeight={500} color="secondary.light">
            Stake ROOT without nominating. The low-risk way of participating.
          </Typography>
          <ExternalLink
            href="https://docs.therootnetwork.com/intro/learn/features/staking-protocol#staking"
            content="Learn more about staking"
          />
        </Grid>
      </Grid>
      <Divider />

      <Grid container height={167} sx={{ mt: 10, mb: 6 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography variant="h1" fontWeight={700} sx={{ lineHeight: '35px', pb: 1 }}>
            Nominate
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3 }}
        >
          <Typography variant="subtitle1" fontWeight={500} color="secondary.light">
            Stake ROOT & nominate validators of your choice to secure the network. You share the
            risk and rewards with validators.
          </Typography>
          <ExternalLink
            href="https://docs.therootnetwork.com/intro/learn/features/staking-protocol#nominating"
            content="Learn more about nominating"
          />
        </Grid>
      </Grid>
      <Divider />

      <Grid container sx={{ mt: 10, mb: 6 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography variant="h1" fontWeight={700} sx={{ lineHeight: '35px', pb: 1 }}>
            Validate
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 3 }}
        >
          <Typography variant="subtitle1" fontWeight={500} color="secondary.light">
            Validating is for technical users. They verify transactions and add new blocks on The
            Root Network. Validators are rewarded for good behavior, and can lose ROOT for bad
            behavior.
          </Typography>
          <ExternalLink
            href="https://docs.therootnetwork.com/intro/learn/features/staking-protocol#validating"
            content="Learn more about validating"
          />
        </Grid>
      </Grid>
      <Divider />
    </Box>
  );
};

export default Participate;
