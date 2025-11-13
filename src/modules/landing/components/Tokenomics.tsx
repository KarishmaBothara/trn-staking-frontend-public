import Link from 'next/link';

import { Box, Divider } from '@mui/material';

import { Typography } from '@futureverse/component-library';

import SnapCard from './SnapCard';

const Tokenomics = () => {
  return (
    <Box
      sx={{
        height: '100%',
        backgroundColor: 'primary.main',
        px: { xs: 2, lg: 9 },
        pt: { xs: 9, lg: 11 },
        pb: 10,
      }}
    >
      <Divider />
      <Box
        display={'flex'}
        flexDirection={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'flex-start', lg: 'center' }}
        justifyContent={'space-between'}
        gap={2}
        sx={{ width: '100%', py: 2, mb: 8 }}
      >
        <Typography variant="overline" fontSize={16} fontWeight={700} color="secondary.light">
          Tokenomics
        </Typography>
        <Typography variant="body1" fontWeight={700} color="secondary.light">
          Check out our{' '}
          <Link
            href="https://docs.therootnetwork.com/learn/tokenomics"
            style={{ color: '#000', textDecoration: 'underline' }}
          >
            technical docs
          </Link>{' '}
          for an explanation of how The Root Network tokenomics work.
        </Typography>
      </Box>
      <Box
        display={'flex'}
        justifyContent={{
          xxl: 'center',
        }}
        gap={3}
        sx={{
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          px: { xs: 2, lg: 9 },
          mx: { xs: -2, lg: -9 },
        }}
      >
        <SnapCard
          id="01"
          title="The Vortex"
          content="Gas & network fees are collected during the reward cycle and transferred into The Vortex."
        />
        <SnapCard
          id="02"
          title="Vortex Tokens"
          content="In each reward cycle, participants are rewarded with newly minted Vortex tokens based on their stake and participation in the network."
        />
        <SnapCard
          id="03"
          title="Bootstrap Rewards"
          content="Bootstrap rewards are calculated based on ROOT staked and are also transferred into The Vortex."
        />
      </Box>
    </Box>
  );
};

export default Tokenomics;
