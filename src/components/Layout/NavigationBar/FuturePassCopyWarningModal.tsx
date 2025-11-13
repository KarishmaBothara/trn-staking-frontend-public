import { Typography } from '@futureverse/component-library';
import { DialogProps } from '@mui/material';
import React from 'react';
import Modal from './Modal';
import ModalLayout from './ModalLayout';

type FuturePassCopyWarningModalProps = DialogProps & {
  address: string;
  // Not optional as we'd want this behaviour whenever we copy FP address
  onCopy: () => void;
  handleClose: () => void;
};

export const FuturePassCopyWarningModal = ({
  onCopy,
  address,
  handleClose,
  ...props
}: FuturePassCopyWarningModalProps) => {
  const handleCopy = React.useCallback(() => {
    void navigator.clipboard.writeText(address);
  }, [address]);

  return (
    <Modal {...props} fullScreenOnMobile>
      <ModalLayout
        title="Important reminder"
        controls={{
          submit: {
            title: 'I Understand',
            onAction: () => {
              handleCopy();
              handleClose();
              onCopy();
            },
          },
          cancel: {
            onAction: handleClose,
          },
        }}
      >
        <Typography>
          Do not send Ethereum collectibles or tokens to this address. Your FuturePass Address is
          exclusive to The Root Network.
        </Typography>
      </ModalLayout>
    </Modal>
  );
};
