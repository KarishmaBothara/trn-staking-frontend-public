import { Table as MuiTable, Paper, TableContainer, TableProps } from '@mui/material';

export const Table = ({ ...props }: TableProps) => {
  return (
    <TableContainer component={Paper}>
      <MuiTable {...props}></MuiTable>
    </TableContainer>
  );
};
