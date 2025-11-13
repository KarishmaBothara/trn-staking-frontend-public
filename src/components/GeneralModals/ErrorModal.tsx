import { FC, useMemo } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import { Modal, Typography } from '@futureverse/component-library';
import appConfig from 'utils/appConfig';
import { IExtrinsicInfo, getExtrinsicId } from 'utils/chainHelper';

interface IErrorModalProps {
  open: boolean;
  title: string;
  error?: string | null;
  txInfo?: IExtrinsicInfo;
  onClose: () => void;
}

const ErrorModal: FC<IErrorModalProps> = ({ open, title, error, txInfo, onClose }) => {
  const config = appConfig();

  const exploreId = useMemo(() => {
    if (txInfo?.txIndex) {
      const extrinsicId = txInfo && getExtrinsicId(txInfo);
      return `/extrinsic/${extrinsicId}`;
    }

    return `/block/${txInfo?.blockHeight}`;
  }, [txInfo]);
  return (
    <Dialog open={open}>
      <Modal handleClose={onClose} header={null}>
        <Box component="div" sx={{ pb: 4 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <CancelIcon
                sx={(theme) => ({
                  fontSize: 36,
                  color: theme.palette.error.main,
                })}
              />
              <Typography variant="h4">{title}</Typography>
            </Stack>

            {error && (
              <Typography
                variant="body1"
                color="primary"
                textTransform="none"
                sx={{ textAlign: 'center' }}
              >
                {error}
              </Typography>
            )}
            {txInfo && (
              <Stack direction="row">
                <Typography variant="body1" fontWeight="bold" color="primary">
                  Extrinsic Id:
                </Typography>
                <Link
                  href={`${config.chain.explorer}/${exploreId}`}
                  underline="none"
                  target="_blank"
                >
                  <Typography variant="body1" color="blue">
                    {`${txInfo?.blockHeight}-${txInfo?.txIndex}`}
                  </Typography>
                </Link>
              </Stack>
            )}
          </Stack>
        </Box>
      </Modal>
    </Dialog>
  );
};

export default ErrorModal;
