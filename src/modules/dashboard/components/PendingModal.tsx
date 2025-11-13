import { useCallback, useState } from 'react';

import { Box, Modal, Stack } from '@mui/material';

import { Button, Typography } from '@futureverse/component-library';
import { BN } from '@polkadot/util';
import Select from 'components/Select';
import { AssetInfo } from 'hooks/useAssets';

export type Action = 'restake' | 'withdraw';
const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', lg: '40%' },
  borderRadius: '1rem',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export interface IPendingModalProps {
  action: Action;
  value: BN;
  open: boolean;
  handleClose: () => void;
  selectedAsset: AssetInfo;
  assets: AssetInfo[];
  handleGasPayment: (value: AssetInfo) => void;
  convertGasFeeToString: string;
  gasConversionStatus: string;
  isGasSufficient: boolean;
  gasToken: any;
  handleConfirm: () => Promise<void>;
}

export const PendingModal = ({
  action,
  value,
  open,
  handleClose,
  selectedAsset,
  assets,
  handleGasPayment,
  convertGasFeeToString,
  gasConversionStatus,
  isGasSufficient,
  gasToken,
  handleConfirm,
}: IPendingModalProps) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" py={3} width={{ xs: '100%', lg: '40%' }}>
          <Typography variant="body1" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
            GAS PAYMENT
          </Typography>
        </Box>
        <Select
          label="GAS PAYMENT"
          defaultGas={selectedAsset}
          menuItems={assets}
          onChange={handleGasPayment}
          ariaLabel="Select gas payment"
          sx={{
            backgroundColor: '#000',
            color: '#FFF',
            '&:hover': {
              backgroundColor: '#FFF',
              color: '#000',
              outline: 'none',
              borderRadius: '.2rem',
              '&.MuiInputBase-root > .MuiSelect-icon': {
                color: '#000',
              },
            },
            '&.Mui-focused': {
              border: 'none',
            },
            '&.MuiInputBase-root': {
              border: '1px solid #424242',
            },
          }}
        />
        <Box display="flex" flexDirection={'column'} py={3} width={{ xs: '100%', lg: '40%' }}>
          <Typography variant="body1" color="text.primary" fontWeight={700}>
            Estimated gas fee
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ overflowX: 'auto' }}>
            {gasConversionStatus === 'loading' && 'Loading gas fee...'}
            {gasConversionStatus === 'success' && convertGasFeeToString}
            {gasConversionStatus === 'failed' && 'Failed to convert gas fee'}
          </Typography>
          {!isGasSufficient && (
            <Typography variant="body1" color="error">
              You do not have enough {gasToken?.symbol || 'XRP'} to cover gas fee
            </Typography>
          )}
        </Box>
        <Box display="flex" justifyContent={'flex-end'}>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 4, mb: 2 }}
            onClick={async () => {
              await handleConfirm();
              handleClose();
            }}
          >
            {action === 'restake' ? 'Confirm Restake' : 'Confirm Withdraw Unstaked'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
