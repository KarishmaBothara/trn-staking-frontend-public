import { TableRow as MuiTableRow, TableRowProps } from '@mui/material';

export const TableRow = ({ children, ...props }: TableRowProps) => {
  return <MuiTableRow {...props}>{children}</MuiTableRow>;
};
