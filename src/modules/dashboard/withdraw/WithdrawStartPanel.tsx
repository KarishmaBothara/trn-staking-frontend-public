import { FC, useState } from 'react';

import { Box, Checkbox, FormControlLabel, Stack } from '@mui/material';

import { Button, Typography } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import { useDeposit } from 'modules/shared/providers/DepositProvider';

import { WithdrawStage } from '../type';

const WithdrawStartPanel: FC = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { setWithdrawStage } = useDeposit();

  return (
    <DrawerContent
      buttonsBar={
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={2}>
          <Button
            variant="contained"
            onClick={() => setWithdrawStage(WithdrawStage.AMOUNT)}
            disabled={!isChecked}
          >
            Unstake Tokens
          </Button>
        </Stack>
      }
    >
      <Box display="flex" flexDirection="column" gap={2} width={{ xs: '100%', lg: '50%' }}>
        <Typography variant="body1" color="text.secondary">
          Unstaking has a 28-day cool-down period. Once the cool-down ends, you must return to
          manually withdraw your tokens — this does not happen automatically.
          <br />
          <br />
          If you're currently Nominating, entering the cool-down period will change your status to
          'Staking' until you complete the withdrawal.
        </Typography>
        <FormControlLabel
          control={<Checkbox />}
          checked={isChecked}
          label={
            <Typography variant="body1">
              I understand that withdrawing before the end of the reward cycle will result in
              forfeiting my rewards for that cycle.
            </Typography>
          }
          onChange={(event: React.SyntheticEvent<Element, Event>) => {
            if (event.target instanceof HTMLInputElement) {
              setIsChecked(event.target.checked);
            }
          }}
        />
      </Box>
    </DrawerContent>
  );
};

export default WithdrawStartPanel;
