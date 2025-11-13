import { Stack } from '@mui/material';

import { numericLocalize } from 'common';

import { useRedeem } from '../provider/RedeemProvider';
import { Typography } from '@futureverse/component-library';
import ExternalLink from 'components/ExternalLink';
import Hint from 'components/Hint';
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from 'components/Table';

import { RedeemStage } from '../type';

const RedemptionPreview = () => {
  const { redeemAssets, setStage } = useRedeem();

  return (
    <Stack direction={'column'} spacing={3}>
      <Hint text="Actual tokens redeemed may differ slightly to this preview">
        <Typography variant="h5" fontWeight={700}>
          Estimated redemption preview
        </Typography>
      </Hint>

      {redeemAssets.length > 0 ? (
        <Table sx={{ width: '100%', mb: 2 }}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {redeemAssets
              .sort((a, b) => b.composition - a.composition)
              .slice(0, 5)
              .map(({ asset, amount }, index) => (
                <TableRow key={index}>
                  <TableDataCell>{asset}</TableDataCell>
                  <TableDataCell>
                    {numericLocalize(amount, {
                      maximumFractionDigits: 6,
                      minimumFractionDigits: 6,
                    })}
                  </TableDataCell>
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
      <ExternalLink
        content="View all tokens"
        onClick={() => {
          setStage(RedeemStage.TOKENS);
        }}
      />
    </Stack>
  );
};

export default RedemptionPreview;
