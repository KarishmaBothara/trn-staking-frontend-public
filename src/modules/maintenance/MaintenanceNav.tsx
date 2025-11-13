import Link from 'next/link';

import { Box, Stack } from '@mui/material';

import LogoSvg from '../../../assets/svgs/union.svg';
import { ReverseColorModeProvider } from '@futureverse/component-library';

const MaintenanceNav = () => {
  return (
    <ReverseColorModeProvider>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          backgroundColor: 'primary.dark',
          display: 'flex',
          justifyContent: { sm: 'center', md: 'flex-start' },
          alignItems: 'center',
          px: 3,
          py: 2,
          width: '100%',
          position: 'relative',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
        }}
      >
        <Box sx={{ width: '15%' }}>
          <Link href="/">
            <LogoSvg />
          </Link>
        </Box>
      </Stack>
    </ReverseColorModeProvider>
  );
};

export default MaintenanceNav;
