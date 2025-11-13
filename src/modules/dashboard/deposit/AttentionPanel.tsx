import { useCallback, useState } from 'react';

import { Box, Checkbox, FormControlLabel } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Button, Typography } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import useStakingStatus from 'hooks/useStakingStatus';
import { DepositStage } from '../type';
import { useTrnApi } from '@futureverse/transact-react';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

const AttentionPanel = () => {
  const { trnApi } = useTrnApi();
  const bondingDuration = trnApi && trnApi.consts.staking.bondingDuration;

  const { setStage, confirmBond, confirmBondAndNominate, confirmBondMore, selectedValidators } =
    useDeposit();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const stakingStatus = useStakingStatus(futurePassAddress || '');

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      if (selectedValidators.length > 0) {
        const isBondMore = !!stakingStatus;
        await confirmBondAndNominate(isBondMore);
      } else {
        if (!stakingStatus) {
          await confirmBond();
        } else {
          await confirmBondMore();
        }
      }
      setStage(DepositStage.CONFIRMATION);
    },
    [
      confirmBond,
      confirmBondAndNominate,
      confirmBondMore,
      selectedValidators?.length,
      setStage,
      stakingStatus,
    ]
  );

  return (
    <>
      <DrawerContent
        buttonsBar={
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
            <Button variant="text" onClick={() => setStage(DepositStage.NOMINATION)}>
              Back
            </Button>
            <Button variant="contained" onClick={handleConfirm} disabled={!isChecked}>
              Stake ROOT
            </Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap={2} width={{ xs: '100%', lg: '50%' }}>
          <Typography variant="h6" color="text.primary" fontWeight={700}>
            Attention
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {`Be aware that if you choose to participate, there is a ${
              bondingDuration?.toString() ?? '28'
            } days waiting period for
            withdrawal of your staked ROOT. This waiting period begins when you initiate a
            withdrawal.`}
          </Typography>
          <FormControlLabel
            control={<Checkbox />}
            checked={isChecked}
            label={<Typography variant="body1">I understand</Typography>}
            onChange={(event: React.SyntheticEvent<Element, Event>) => {
              if (event.target instanceof HTMLInputElement) {
                setIsChecked(event.target.checked);
              }
            }}
          />
        </Box>
      </DrawerContent>
    </>
  );
};

export default AttentionPanel;
