import { Stack } from '@mui/material';

import { numericLocalize } from 'common';

import { useRedeem } from '../provider/RedeemProvider';
import { Typography } from '@futureverse/component-library';
import Pagination from 'components/Pagination';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'components/Table';

const RedemptionAllTokens = () => {
  const { redeemAssets, assetsPage } = useRedeem();

  return (
    <Stack direction={'column'} spacing={3}>
      {redeemAssets.length > 0 ? (
        <Table sx={{ width: '60%' }}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Composition %</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {redeemAssets.map(({ asset, amount, composition }, index) => (
              <TableRow key={index}>
                <TableDataCell>{asset}</TableDataCell>
                <TableDataCell>
                  {numericLocalize(amount, {
                    maximumFractionDigits: 6,
                    minimumFractionDigits: 6,
                  })}
                </TableDataCell>
                <TableDataCell>{numericLocalize(composition)} %</TableDataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <>
          <Typography variant="body1" color="primary.main" sx={{ fontWeight: 700 }}>
            You don't currently hold any vortex
          </Typography>
        </>
      )}

      <Pagination count={1} page={assetsPage} />
    </Stack>
  );
};

export default RedemptionAllTokens;
