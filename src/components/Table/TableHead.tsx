import { TableHead as MuiTableHead, TableHeadProps } from '@mui/material';

export const TableHead = ({ sx, children, ...props }: TableHeadProps) => {
  return (
    <MuiTableHead
      {...props}
      sx={{
        ...sx,
        '& th': { border: 0 },
      }}
    >
      {children}
    </MuiTableHead>
  );
};
