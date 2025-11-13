import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

export type ModalProps = DialogProps & {
  fullScreenOnMobile?: boolean;
};

export default function Modal({ children, ...props }: ModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const fullScreen = props.fullScreen || (props.fullScreenOnMobile && isMobile);
  return (
    <Dialog
      {...props}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#000000',
          border: '1px solid #2D2D2D',
          maxWidth: fullScreen ? 'none' : '636px',
          width: '100%',
          height: fullScreen ? '100%' : 'auto',
          borderRadius: fullScreen ? '0px' : '8px',
          maxHeight: fullScreen ? 'none' : 'auto',
          margin: fullScreen ? '0' : undefined,
        },
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Dialog>
  );
}
