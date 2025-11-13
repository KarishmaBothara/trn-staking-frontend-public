import Link from 'next/link';

import { Box } from '@mui/material';

import LogoSvg from '../../../assets/svgs/union.svg';
import Footer from './components/Footer';
import Participate from './components/Participate';
import Tokenomics from './components/Tokenomics';
import Vortex from './components/Vortex';
import { Button, ReverseColorModeProvider, Typography } from '@futureverse/component-library';
import Intercom from '@intercom/messenger-js-sdk';
import appConfig from 'utils/appConfig';

const Landing = () => {
  Intercom({
    api_base: 'https://api-iam.intercom.io',
    app_id: appConfig().intercomId,
  });

  return (
    <>
      <ReverseColorModeProvider>
        <Box sx={{ height: '100%', backgroundColor: 'primary.dark', py: { xs: '10px', lg: 3 } }}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            sx={{ width: '100%', px: { xs: 2, lg: 5 } }}
          >
            <LogoSvg />
            <Link href="/dashboard">
              <Button>Launch App</Button>
            </Link>
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={3}
            sx={{ width: '100%', px: { xs: 2, lg: 9 }, py: { xs: 4, lg: 7 } }}
          >
            <Typography
              variant="h1"
              lineHeight="120%"
              fontWeight={700}
              color="primary.main"
              sx={{
                fontSize: { xs: 56, lg: 108 },
              }}
            >
              Earn rewards for securing The Root Network PoS network
            </Typography>
          </Box>
        </Box>
      </ReverseColorModeProvider>
      <Vortex />
      <Tokenomics />
      <Participate />
      <Footer />
    </>
  );
};

export default Landing;
