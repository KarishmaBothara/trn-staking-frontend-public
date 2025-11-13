import { Box, Stack, SxProps, Theme, Tooltip } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import Hint from 'components/Hint';

interface IProps {
  heading: string;
  information: React.ReactNode;
  action?: React.ReactNode;
  variant?: 'dark' | 'light';
  size?: 'large' | 'small';
  sx?: SxProps<Theme>;
  hintText?: React.ReactNode;
  showHint?: boolean;
}

const InformationCard = ({
  heading,
  information,
  action,
  variant = 'dark',
  size = 'large',
  sx,
  hintText = '',
  showHint = false,
}: IProps) => {
  return (
    <Stack direction={'column'} spacing={size === 'large' ? { xs: 2, lg: 4 } : 3} sx={sx}>
      <Hint text={showHint ? hintText : ''}>
        <Typography
          variant="body1"
          color={variant === 'dark' ? 'primary.main' : 'secondary.dark'}
          fontWeight={700}
          sx={{ textTransform: 'uppercase' }}
        >
          {heading}
        </Typography>
      </Hint>

      {information}
      {action && action}
    </Stack>
  );
};

export default InformationCard;
