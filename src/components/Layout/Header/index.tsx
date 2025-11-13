import { ReactNode } from 'react';

import { Box, Stack } from '@mui/material';

import { ReverseColorModeProvider, Typography } from '@futureverse/component-library';

interface HeaderProps {
  heading: string;
  subheading?: ReactNode;
  externalLink?: ReactNode;
  content?: ReactNode;
}

const Header = ({ heading, subheading, externalLink, content }: HeaderProps) => {
  return (
    <ReverseColorModeProvider>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={4}
        sx={{
          backgroundColor: 'primary.dark',
          borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
          px: { xs: 1, lg: 7 },
          py: { xs: 8, lg: 11 },
          width: '100%',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction={'column'} spacing={1} sx={{ maxWidth: { xs: '100%', lg: '40%' } }}>
          <Typography variant="h5" color="primary.main" fontWeight={700}>
            {heading}
          </Typography>

          {subheading}

          {externalLink && externalLink}
        </Stack>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'end' }}>
          {content && content}
        </Box>
      </Stack>
    </ReverseColorModeProvider>
  );
};

export default Header;
