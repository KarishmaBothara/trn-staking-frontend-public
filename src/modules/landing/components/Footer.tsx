import { Box, Grid, IconButton, Link, Stack } from '@mui/material';

import FooterLogoSvg from '../../../../assets/svgs/footer_logo.svg';
import { IconFactory, ReverseColorModeProvider, Typography } from '@futureverse/component-library';

const Footer = () => {
  return (
    <ReverseColorModeProvider>
      <Box
        sx={{
          backgroundColor: 'primary.dark',
          px: { xs: 2, lg: 7 },
          py: 3,
        }}
      >
        <Grid container sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" color={'secondary.dark'}>
              Community
            </Typography>
            <Link href="https://twitter.com/TheRootNetwork">
              <Typography variant="body2">Twitter</Typography>
            </Link>

            <Link href="http://discord.gg/therootnetwork">
              <Typography variant="body2">Discord</Typography>
            </Link>
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" color={'secondary.dark'}>
              Learn
            </Typography>
            <Link href="https://vortexdashboard.therootnetwork.com">
              <Typography variant="body2">Vortex Calculator</Typography>
            </Link>
            <Link href="https://www.futureverse.com/research?index=whitepaper">
              <Typography variant="body2">Whitepaper</Typography>
            </Link>
            <Link href="https://docs.therootnetwork.com/learn/tokenomics">
              <Typography variant="body2">Documentation</Typography>
            </Link>
            <Link href="https://github.com/futureversecom">
              <Typography variant="body2">Github</Typography>
            </Link>
          </Grid>
        </Grid>

        <Box
          mt={14}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            href="https://www.therootnetwork.com/"
            target="_blank"
            rel="noreferrer"
          >
            <FooterLogoSvg />
          </IconButton>
          <Stack direction={'row'} spacing={2} sx={{ paddingRight: 5 }}>
            <Link
              href="https://www.therootnetwork.com/policies/terms"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="caption" color={'secondary.dark'}>
                Terms of Service
              </Typography>
            </Link>
            <Link
              href="https://www.therootnetwork.com/policies/privacy-policy"
              target="_blank"
              rel="noreferrer"
            >
              <Typography variant="caption" color={'secondary.dark'}>
                Privacy Policy
              </Typography>
            </Link>
          </Stack>
        </Box>
      </Box>
    </ReverseColorModeProvider>
  );
};

export default Footer;
