import { useMemo } from 'react';

import { Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';

interface IProps {
  value: number | string;
  size: 'large' | 'small';
}

const DecimalViewer = ({ value, size }: IProps) => {
  const [integer, decimal] = useMemo(() => {
    if (typeof value === 'number' && isNaN(value)) {
      return [0, 0];
    }
    return `${value}`.split('.');
  }, [value]);

  return (
    <Stack direction={'row'} alignItems="flex-start">
      <Typography
        variant="h1"
        color="primary.main"
        fontSize={56}
        sx={{
          verticalAlign: 'top',
          lineHeight: '90px',
          ...(size === 'large'
            ? {
                fontSize: { xs: 56, lg: 110 },
                fontWeight: 700,
              }
            : { fontSize: 56, lineHeight: '50px' }),
        }}
      >
        {integer}
      </Typography>
      <Typography
        variant="h3"
        color="primary.main"
        sx={{
          fontWeight: 700,
          verticalAlign: 'top',
          ...(size === 'large'
            ? { fontSize: 34, lineHeight: '34px' }
            : { fontSize: 18, lineHeight: '18px' }),
        }}
      >
        .{decimal ? String(decimal).slice(0, 6) : '00'}
      </Typography>
    </Stack>
  );
};

export default DecimalViewer;
