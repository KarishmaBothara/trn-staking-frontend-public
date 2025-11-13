import { useCallback, useEffect, useMemo, useState } from 'react';

import { Box, Stack } from '@mui/material';

import { Table } from '../../../components/Table/Table';
import { Button, Typography } from '@futureverse/component-library';
import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { BN, BN_ZERO } from '@polkadot/util';
import { DECIMALS } from 'common/types';
import { TableBody, TableDataCell, TableHead, TableHeaderCell, TableRow } from 'components/Table';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useCall } from 'hooks/useCall';
import useSlashingSpans from 'hooks/useSlashingSpans';
import useStakingStatus from 'hooks/useStakingStatus';
import UnbondTime from 'modules/unbond/UnbondTime';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import { calcUnbonding, extractTotals } from 'utils/calcUnbonding';
import { unscaleBy } from 'utils/polkadotBN';

import { Action, PendingModal } from './PendingModal';
import { useTrnApi } from '@futureverse/transact-react';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

const PendingActions = () => {
  const { trnApi } = useTrnApi();

  const [restakeAmount, setRestakeAmount] = useState<BN>(BN_ZERO);
  const [action, setAction] = useState<Action>('restake');

  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const {
    confirmRebond,
    handleRebond,
    confirmWithdrawUnbonded,
    handleWithdrawUnbonded,
    gasToken,
    handleSetGasToken,
    convertGasFeeToString,
    gasConversionStatus,
    isGasSufficient,
  } = useRootTransaction();
  const sessionProgress = useCall<DeriveSessionProgress>(trnApi && trnApi.derive.session.progress);
  const slashingSpans = useSlashingSpans(futurePassAddress || '');
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const { assets, selectedAsset } = useAssets();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpen = (value: BN, action: Action) => {
    setRestakeAmount(value);
    setAction(action);
    setModalOpen(true);
  };

  const handleConfirm = useCallback(async () => {
    if (action === 'restake') {
      await handleRebond(restakeAmount);
    } else {
      await handleWithdrawUnbonded(restakeAmount);
    }
  }, [action, handleRebond, handleWithdrawUnbonded, restakeAmount]);

  const handleClose = () => setModalOpen(false);

  const unbondingInfo = useMemo(
    () =>
      sessionProgress && stakingStatus && stakingStatus.unlocking
        ? calcUnbonding(sessionProgress, stakingStatus?.unlocking as any[])
        : undefined,
    [sessionProgress, stakingStatus]
  );

  const [mapped] = useMemo(
    () => extractTotals(unbondingInfo, sessionProgress),
    [sessionProgress, unbondingInfo]
  );

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleSetGasToken(value);
    },
    [handleSetGasToken]
  );

  useEffect(() => {
    const rebond = async () => {
      try {
        if (action === 'restake') {
          await confirmRebond(restakeAmount);
        } else {
          await confirmWithdrawUnbonded(restakeAmount);
        }
      } catch (error) {
        console.error(error);
      }
    };
    rebond();
  }, [action, confirmRebond, confirmWithdrawUnbonded, restakeAmount]);

  return (
    <Stack direction="column" spacing={5} sx={{ mt: 8 }}>
      <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
        Pending actions
      </Typography>
      {mapped.length > 0 ||
      (unbondingInfo?.redeemable && unbondingInfo?.redeemable?.gt(BN_ZERO)) ? (
        <Table sx={{ width: { xs: '200%', md: '100%' } }}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>type</TableHeaderCell>
              <TableHeaderCell>root</TableHeaderCell>
              <TableHeaderCell>wait time</TableHeaderCell>
              <TableHeaderCell>actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mapped.map((item, index) => {
              const [{ value }, eras, blocks] = item;
              return (
                <TableRow key={index}>
                  <TableDataCell>Unstaking</TableDataCell>
                  <TableDataCell>{`${unscaleBy(value, DECIMALS)}`}</TableDataCell>
                  <TableDataCell>
                    <UnbondTime eras={eras} blocks={blocks} />
                  </TableDataCell>

                  <TableDataCell>
                    <Box>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          handleOpen(value, 'restake');
                        }}
                      >
                        Restake
                      </Button>
                    </Box>
                  </TableDataCell>
                </TableRow>
              );
            })}
            {!unbondingInfo?.redeemable ||
              (unbondingInfo?.redeemable?.gt(BN_ZERO) && (
                <TableRow>
                  <TableDataCell>Redeem</TableDataCell>
                  <TableDataCell>{`${unscaleBy(
                    unbondingInfo?.redeemable,
                    DECIMALS
                  )}`}</TableDataCell>
                  <TableDataCell>{/* <UnbondTime eras={0} blocks={0} /> */}</TableDataCell>

                  <TableDataCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={async () => {
                        handleOpen(new BN(slashingSpans), 'withdraw');
                      }}
                    >
                      Withdraw unstaked
                    </Button>
                  </TableDataCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <Typography variant="body1" color="primary.main">
          You don’t have any pending actions
        </Typography>
      )}
      <PendingModal
        action={action}
        value={restakeAmount}
        open={modalOpen}
        handleClose={handleClose}
        selectedAsset={selectedAsset}
        assets={assets}
        handleGasPayment={handleGasPayment}
        convertGasFeeToString={convertGasFeeToString}
        gasConversionStatus={gasConversionStatus || ''}
        isGasSufficient={isGasSufficient}
        gasToken={gasToken}
        handleConfirm={handleConfirm}
      ></PendingModal>
    </Stack>
  );
};

export default PendingActions;
