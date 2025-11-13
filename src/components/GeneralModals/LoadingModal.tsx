import { FC } from 'react';

import LoopIcon from '@mui/icons-material/Loop';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Stack from '@mui/material/Stack';

import { Modal, Typography } from '@futureverse/component-library';

interface ILoadingModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
}

const LoadingModal: FC<ILoadingModalProps> = ({ open, title, onClose }) => {
  return (
    <Dialog open={open}>
      <Modal handleClose={onClose} header={null}>
        <Box component="div" sx={{ pb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <LoopIcon
              sx={(theme) => ({
                fontSize: 36,
                color: theme.palette.info.main,
                animation: 'spin 2s linear infinite',
                '@keyframes spin': {
                  '0%': {
                    transform: 'rotate(360deg)',
                  },
                  '100%': {
                    transform: 'rotate(0deg)',
                  },
                },
              })}
            />
            <Typography variant="h4">{title}</Typography>
          </Stack>
        </Box>
      </Modal>
    </Dialog>
  );
};

export default LoadingModal;
