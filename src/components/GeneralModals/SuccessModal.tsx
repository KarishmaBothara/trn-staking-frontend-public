import { FC, ReactElement } from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';

import { Modal, Typography } from '@futureverse/component-library';

interface ISuccessModalProps {
  open: boolean;
  title: string;
  children?: ReactElement | null;
  onClose: () => void;
}

const SuccessModal: FC<ISuccessModalProps> = ({ open, title, children, onClose }) => {
  return (
    <Dialog open={open}>
      <Modal handleClose={onClose} header={null}>
        <Box component="div" sx={{ pb: 4 }}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CheckCircleIcon
                sx={(theme) => ({
                  fontSize: 36,
                  color: theme.palette.success.main,
                })}
              />
              <Typography variant="h4">{title}</Typography>
            </Stack>

            {children}
          </Stack>
        </Box>
      </Modal>
    </Dialog>
  );
};

export default SuccessModal;
