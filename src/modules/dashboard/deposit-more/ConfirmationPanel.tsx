import { useCallback } from 'react';

import { Box, Stack } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Button, Typography } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import ExtrinsicData from 'modules/shared/components/ExtrinsicData';
import { useRootTransaction } from 'providers/RootTransactionProvider';

import { DepositMoreStage } from '../type';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

interface IProps {
  onFinish: () => void;
}

const ConfirmationPanel = ({ onFinish }: IProps) => {
  const { setDepositMoreStage, bondMore, amount, gasToken, isGasSufficient } = useDeposit();
  const { encodedMessage, gasFee, convertGasFeeToString } = useRootTransaction();
  const { data: futurePassAddress } = useFuturePassAccountAddress();

  const handleConfirm = useCallback(
    async (e: { target: { value: string } }) => {
      await bondMore();
      onFinish();
    },
    [bondMore, onFinish]
  );

  return (
    <>
      <DrawerContent
        buttonsBar={
          <Box display="flex" flexDirection="row" justifyContent="flex-end" gap={1} width="400px">
            <Button variant="text" onClick={() => setDepositMoreStage(DepositMoreStage.AMOUNT)}>
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={
                !encodedMessage || !isGasSufficient || Number(amount) <= 0 || gasFee === null
              }
            >
              Continue
            </Button>
          </Box>
        }
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width={{ xs: '100%', lg: '50%' }}
          sx={{ marginBottom: '32px' }}
        >
          <Typography
            variant="h5"
            color="text.primary"
            fontWeight={700}
            sx={{ maxWidth: 418, mt: 2 }}
          >
            Before proceeding please confirm that the following details are correct
          </Typography>
        </Box>
        <Stack spacing={4} sx={{ marginBottom: '48px' }}>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              Nominating
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {amount} ROOT
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              From
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {futurePassAddress}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              This message will be encoded into
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ overflowX: 'auto' }}>
              {encodedMessage?.encodedMessage}
            </Typography>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="body1" color="text.primary" fontWeight={700}>
              Estimated gas fee
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ overflowX: 'auto' }}>
              {convertGasFeeToString}
            </Typography>
            {!isGasSufficient && (
              <Typography variant="body1" color="error">
                You do not have enough {gasToken?.symbol || 'XRP'} to cover gas fee
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack>
          <ExtrinsicData />
        </Stack>
      </DrawerContent>
    </>
  );
};

export default ConfirmationPanel;
