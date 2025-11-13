import * as React from 'react';

import { Box } from '@mui/material';

import { Footer, NavigationBar } from 'components/Layout';

import useSignInHandler from 'hooks/useSignInHandler';
import { usePathname } from 'next/navigation';

export const NAV_SCROLL_ID = 'navScrollContainer';

interface NavigationContainerProps {
  children: React.ReactNode;
}

const NavigationContainer: React.FC<NavigationContainerProps> = ({ children }) => {
  useSignInHandler();
  const pathname = usePathname();

  return pathname === '/' ? (
    <>{children}</>
  ) : (
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
      <NavigationBar />
      <Box sx={{ mb: 12 }}>{children}</Box>
      <Footer />
    </Box>
  );
};

export default NavigationContainer;
