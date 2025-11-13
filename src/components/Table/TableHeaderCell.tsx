import { Typography } from '@futureverse/component-library';

import { TableCell, TableCellProps } from './TableCell';

export const TableHeaderCell = ({ children, ...props }: TableCellProps) => {
  return (
    <TableCell {...props}>
      {typeof children === 'string' ? (
        <Typography variant="button" color="secondary.light" sx={{ fontWeight: '700' }}>
          {children}
        </Typography>
      ) : (
        children
      )}
    </TableCell>
  );
};
