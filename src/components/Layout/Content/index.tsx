import { Box } from '@mui/material';

import { ReverseColorModeProvider } from '@futureverse/component-library';

const Content = ({ children }: { children: React.ReactNode | React.ReactNode[] }) => {
  return (
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
        }}
      >
        {children}
      </Box>
    </ReverseColorModeProvider>
  );
};

export default Content;
