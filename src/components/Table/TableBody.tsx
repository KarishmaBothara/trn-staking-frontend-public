import { TableBody as MuiTableBody, TableBodyProps } from '@mui/material';

export const TableBody = ({ sx, children, ...props }: TableBodyProps) => {
  return (
    <MuiTableBody
      {...props}
      sx={{
        ...sx,
        '& td': { borderColor: 'primary.main' },
      }}
    >
      {children}
    </MuiTableBody>
  );
};
