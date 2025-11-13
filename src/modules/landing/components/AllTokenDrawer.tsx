import { useEffect, useMemo, useState } from 'react';

import { Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import { numericLocalize } from 'common/utils';
import Drawer from 'components/Drawer';
import DrawerContent from 'components/Layout/DrawerContent';
import Pagination from 'components/Pagination';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'components/Table';

interface IProps {
  open: boolean;
  onClose: () => void;
  geckoData: any;
}

export const AllTokenDrawer = ({ open, onClose, geckoData }: IProps) => {
  const [totalPage, setTotalPage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  useEffect(() => {
    if (geckoData?.response) {
      const totalPage = Math.ceil(geckoData.response.length / 10);
      setTotalPage(totalPage);
    }
  }, [geckoData]);

  const rankingData = useMemo(() => {
    if (geckoData?.response) {
      const data = [...geckoData.response];
      const start = currentPage * 10;
      const end = start + 10;
      return data
        .sort((a, b) => b[1].added_this_cycle.localeCompare(a[1].added_this_cycle))
        .slice(start, end);
    }
    return [];
  }, [geckoData, currentPage]);

  const handlePageChange = (_e: any, page: number) => {
    setCurrentPage(page - 1);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      HeaderContents={
        <Typography variant="h3" fontWeight={700}>
          View all tokens
        </Typography>
      }
    >
      <DrawerContent
        buttonsBar={
          <Stack direction={'row'} justifyContent={'flex-start'} sx={{ width: '100%' }}>
            <Pagination
              count={totalPage}
              page={currentPage + 1}
              onChange={handlePageChange}
              sx={{ mt: 4, mb: 3 }}
            />
          </Stack>
        }
      >
        {rankingData.length > 0 && (
          <>
            <Table sx={{ width: { xs: '200%', md: '100%' } }}>
              <TableHead>
                <TableRow>
                  <TableHeaderCell sx={{ pl: 4 }}>asset</TableHeaderCell>
                  <TableHeaderCell>amount</TableHeaderCell>
                  <TableHeaderCell>percentage of pool</TableHeaderCell>
                  <TableHeaderCell align="right" sx={{ pr: 8 }}>
                    change this cycle
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankingData.map((item) => {
                  const [token, { amount, percentage, added_this_cycle }] = item;
                  return (
                    <TableRow key={token}>
                      <TableDataCell sx={{ pl: 4 }}>{token}</TableDataCell>
                      <TableDataCell>
                        {numericLocalize(amount, {
                          maximumFractionDigits: 6,
                          minimumFractionDigits: 6,
                        })}
                      </TableDataCell>
                      <TableDataCell>{`${Number(percentage).toFixed(6)}%`}</TableDataCell>
                      <TableDataCell align="right" sx={{ pr: 8 }}>{`+${numericLocalize(
                        added_this_cycle,
                        {
                          maximumFractionDigits: 6,
                          minimumFractionDigits: 6,
                        }
                      )}`}</TableDataCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default AllTokenDrawer;
