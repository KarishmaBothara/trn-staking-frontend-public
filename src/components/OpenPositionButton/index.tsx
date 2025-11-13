import { Box, BoxProps, Stack } from '@mui/material';

import { IconButton, IconFont, ReverseColorModeProvider } from '@futureverse/component-library';
import RectIcon from 'components/RectIcon';

interface IProps extends BoxProps {
  onClick?: () => void;
}

const OpenPositionButton = ({ children, onClick, sx }: React.PropsWithChildren<IProps>) => {
  return (
    <ReverseColorModeProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'primary.dark',
          px: 3,
          py: 2,
          borderRadius: 1,
          ...sx,
        }}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={2}>
          <RectIcon name="Root" />
          {children}
        </Stack>

        <IconButton variant="contained" onClick={onClick} size="large">
          <IconFont name="arrow_forward" />
        </IconButton>
      </Box>
    </ReverseColorModeProvider>
  );
};

export default OpenPositionButton;
