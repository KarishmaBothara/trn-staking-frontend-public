import { Typography } from '@futureverse/component-library';

import { TableCell, TableCellProps } from './TableCell';

export const TableDataCell = ({ children, ...props }: TableCellProps) => {
  return (
    <TableCell {...props}>
      {typeof children === 'string' ? (
        <Typography variant="subtitle1" sx={{ fontWeight: '700' }}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TableCell>
  );
};
