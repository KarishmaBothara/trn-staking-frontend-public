import { FC } from 'react';

import MuiPagination, { PaginationProps } from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const Pagination: FC<PaginationProps> = (props) => {
  return (
    <MuiPagination
      {...props}
      variant="outlined"
      shape="rounded"
      showLastButton
      showFirstButton
      renderItem={(item) => (
        <PaginationItem
          {...item}
          sx={{
            '&.Mui-selected': {
              backgroundColor: 'secondary.main',
            },
            '&:hover': {
              backgroundColor: 'secondary.main',
            },
          }}
        />
      )}
    />
  );
};

export default Pagination;
