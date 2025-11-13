import { useMemo, useState } from 'react';

import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { Box, Popover, Stack } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { DECIMALS } from 'common/types';
import { useCall } from 'hooks/useCall';
import useStakingStatus from 'hooks/useStakingStatus';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';
import { calcUnbonding, extractTotals } from 'utils/calcUnbonding';
import { unscaleBy } from 'utils/polkadotBN';

import UnbondTime from './UnbondTime';
import { useTrnApi } from '@futureverse/transact-react';

const UnbondValue = () => {
  const { trnApi } = useTrnApi();

  const { data: futurePassAddress } = useFuturePassAccountAddress();

  const sessionProgress = useCall<DeriveSessionProgress>(trnApi && trnApi.derive.session.progress);

  const stakingStatus = useStakingStatus(futurePassAddress || '');

  const unbondingInfo = useMemo(
    () =>
      sessionProgress && stakingStatus && stakingStatus.unlocking
        ? calcUnbonding(sessionProgress, stakingStatus?.unlocking as any[])
        : undefined,
    [sessionProgress, stakingStatus]
  );

  const [mapped, total, isStalled] = useMemo(
    () => extractTotals(unbondingInfo, sessionProgress),
    [sessionProgress, unbondingInfo]
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Stack
        direction="row"
        spacing={2}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onClick={(e) => {
          anchorEl ? handlePopoverClose() : handlePopoverOpen(e);
        }}
      >
        <AccessTimeFilledIcon />
        <Typography className="mb-4" variant="body2">
          {unscaleBy(total, DECIMALS)} ROOT unstaking
        </Typography>
      </Stack>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box component="div" sx={{ padding: 2 }}>
          {mapped.map((item, index) => {
            const [{ value }, eras, blocks] = item;
            return (
              <Stack key={`unbonding-${index}`}>
                <Typography className="mb-4" variant="body2">
                  {unscaleBy(value, DECIMALS)} ROOT
                </Typography>
                <UnbondTime eras={eras} blocks={blocks} />
              </Stack>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
};

export default UnbondValue;
