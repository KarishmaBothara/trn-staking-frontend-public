import { Box, IconButton, Link, Stack } from '@mui/material';

import { IconFactory, Typography } from '@futureverse/component-library';

const Footer = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        backgroundColor: 'primary.dark',

        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,

        px: 7,
        py: 3,
      }}
    >
      <IconButton href="https://www.therootnetwork.com/" target="_blank" rel="noreferrer">
        <IconFactory name="Root" width={24} />
      </IconButton>

      <Stack direction={'row'} spacing={2} sx={{ paddingRight: 5 }}>
        <Link href="https://www.therootnetwork.com/policies/terms" target="_blank" rel="noreferrer">
          <Typography variant="caption" color={'secondary.light'}>
            Terms of Service
          </Typography>
        </Link>
        <Link
          href="https://www.therootnetwork.com/policies/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          <Typography variant="caption" color={'secondary.light'}>
            Privacy Policy
          </Typography>
        </Link>
      </Stack>
    </Box>
  );
};

export default Footer;
