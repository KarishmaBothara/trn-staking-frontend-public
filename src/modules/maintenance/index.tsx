import Link from 'next/link';

import { Box, Divider, Stack } from '@mui/material';

import { Button, ReverseColorModeProvider, Typography } from '@futureverse/component-library';
import Content from 'components/Layout/Content';
import Footer from 'components/Layout/Footer';

import MaintenanceNav from './MaintenanceNav';

const Maintenance = () => {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        paddingBottom: '0',
        backgroundColor: 'primary.dark',
        position: 'relative',
        inset: 0,

        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',

        px: { xs: 1, lg: 2 },
        pt: { xs: 1, lg: 2 },
      }}
    >
      <MaintenanceNav />
      <ReverseColorModeProvider>
        <Box
          sx={{
            backgroundColor: 'primary.dark',
            borderBottom: '1px solid grey',
            borderBottomLeftRadius: 26,
            borderBottomRightRadius: 26,
            px: { xs: 1, lg: 7 },
            pt: 4,
            pb: { xs: 8, lg: 9 },
            height: '80vh',
          }}
        >
          <Stack sx={{ width: '50%' }} spacing={4}>
            <Typography variant="h1" fontWeight={700} color="primary.main">
              FuturePass is currently undergoing maintenance
            </Typography>
            <Stack sx={{ width: '70%' }}>
              <Typography variant="body1" color="primary.main">
                Your rewards from staking & nominating are still accumulating.
              </Typography>
              <Typography variant="body1" color="primary.main">
                You will be able to launch the app soon. Thank you for your patience.
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </ReverseColorModeProvider>

      <Footer />
    </Box>
  );
};

export default Maintenance;
