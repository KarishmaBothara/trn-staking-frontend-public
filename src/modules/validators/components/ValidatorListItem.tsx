import { Box, Checkbox, Chip, Tooltip, Link } from '@mui/material';

import { numericLocalize } from 'common';

import { Typography } from '@futureverse/component-library';
import { BN } from '@polkadot/util';
import { DECIMALS } from 'common/types';
import { TableDataCell, TableRow } from 'components/Table';
import { shortenAddr } from 'utils/format-utils';
import { unscaleBy } from 'utils/polkadotBN';

interface IProps {
  address: string;
  status: string;
  commission: number;
  totalStake: BN;
  nominators: number;
  validatorNames: Record<string, string>;
  isSelected?: boolean;
  onSelect?: (address: string) => void;
  isOversubscribed?: boolean;
}

const ValidatorListItem = ({
  address,
  status,
  commission,
  totalStake,
  nominators,
  validatorNames,
  isSelected,
  onSelect,
  isOversubscribed,
}: IProps) => {
  return (
    <TableRow
      onClick={() => onSelect?.(address)}
      sx={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'secondary.main',
        },
      }}
    >
      <TableDataCell>
        <Box display="flex" alignItems="flex-start">
          {onSelect && <Checkbox checked={isSelected} />}
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body1">
              {validatorNames[address] && validatorNames[address].includes('0x')
                ? shortenAddr(address)
                : validatorNames[address]}
            </Typography>
            <Typography variant="caption">{shortenAddr(address)}</Typography>
          </Box>
        </Box>
      </TableDataCell>
      <TableDataCell>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            '&::before': {
              content: '" "',
              width: '8px',
              height: '8px',
              bgcolor: status === 'Active' ? '#008936' : '#767676',
              borderRadius: '50%',
              display: 'inline-block',
              mr: 1,
            },
          }}
        >
          {status}
        </Typography>
      </TableDataCell>
      <TableDataCell>
        <>
          {nominators}{' '}
          {isOversubscribed && (
            <Box component="div" sx={{ paddingLeft: '12px' }}>
              <Tooltip
                placement="top-start"
                title={
                  <Typography variant="subtitle1" color="black">
                    Only the top 256 Nominators to a Validator will earn rewards based on the amount
                    of ROOT nominated. Learn more{' '}
                    <Link
                      href="https://docs.therootnetwork.com/intro/learn/features/staking-protocol"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="inherit"
                      underline="none"
                      color={'black'}
                      sx={{ fontSize: 'inherit' }}
                    >
                      here
                    </Link>
                  </Typography>
                }
                sx={{ alignSelf: 'start', cursor: 'pointer' }}
              >
                <Chip
                  label="Oversubscribed"
                  sx={{
                    backgroundColor: '#FAB400 !important',
                    color: '#000000',
                    border: 'none',
                    '&:hover': {
                      backgroundColor: '#FAB400 !important',
                      color: '#000000 !important',
                      border: 'none !important',
                    },
                  }}
                />
              </Tooltip>
            </Box>
          )}
        </>
      </TableDataCell>
      <TableDataCell>
        {numericLocalize(unscaleBy(totalStake, DECIMALS).join(''), {
          maximumFractionDigits: 6,
          minimumFractionDigits: 6,
        })}
      </TableDataCell>
      <TableDataCell>{commission.toFixed(2)}%</TableDataCell>
    </TableRow>
  );
};

export default ValidatorListItem;
