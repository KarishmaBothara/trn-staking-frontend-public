import { ReactNode } from 'react';

import {
  TableCell as MuiTableCell,
  TableCellProps as MuiTableCellProps,
  Stack,
} from '@mui/material';

export interface TableCellProps extends MuiTableCellProps {
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
}

const alignMap = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  inherit: 'center',
  justify: 'space-between',
};

export const TableCell = ({
  icon,
  iconPosition = 'end',
  children,
  align,
  ...props
}: TableCellProps) => {
  return (
    <MuiTableCell {...props}>
      <Stack
        direction={'row'}
        spacing={1}
        alignItems={'center'}
        justifyContent={align ? alignMap[align] : 'left'}
      >
        {iconPosition === 'start' && icon}
        {children}
        {iconPosition === 'end' && icon}
      </Stack>
    </MuiTableCell>
  );
};
