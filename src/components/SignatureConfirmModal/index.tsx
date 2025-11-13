import React, { useMemo } from 'react';

import { Divider, styled } from '@mui/material';
import Box from '@mui/material/Box';

import { Button, Modal, Typography } from '@futureverse/component-library';
import { BN } from '@polkadot/util';
import { XRP_ASSET_ID } from 'common/types';
import useBalance from 'hooks/useBalance';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

interface IProps {
  rawMessage: Record<string, unknown>;
  encodedMessage: string;
  gasFee: string;
  pending: boolean;
  isInsufficientBalance: boolean;
  estimatedGasFee: BN;
  onContinue: () => void;
  onClose: () => void;
}

const StyledTR = styled('tr')`
  vertical-align: top;
`;

const StyledTD = styled('td')`
  max-width: 360px;
  word-wrap: break-word;
`;

const SignatureConfirmModal: React.FC<IProps> = ({
  rawMessage,
  encodedMessage,
  gasFee,
  pending = false,
  estimatedGasFee,
  onClose,
  onContinue,
}) => {
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const balance = useBalance(futurePassAddress, [XRP_ASSET_ID]);

  const isInsufficientBalance = useMemo(() => {
    if (!estimatedGasFee) return false;
    const xrpBalance = balance[0]?.balance ?? 0;
    return estimatedGasFee?.gt(xrpBalance) ?? false;
  }, [balance, estimatedGasFee]);

  return (
    <Modal
      aria-labelledby="signature-confirm"
      aria-describedby="signature-confirm"
      handleClose={onClose}
      header={
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <Typography variant="h5">Transaction Confirmation</Typography>
        </div>
      }
      sx={{ overflowY: 'auto' }}
    >
      <Box
        component="div"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        textAlign="left"
        maxWidth={556}
        mb={3}
        gap={1}
      >
        <Typography variant="body1" color="black" sx={{ mb: 1 }}>
          Sign signature request from your MetaMask wallet.
        </Typography>

        <Box
          component="div"
          sx={{
            width: '100%',
            maxHeight: '300px',
            borderLeft: '6px solid #181B25',
            px: '10px',
            mb: 2,
            overflowY: 'auto',
          }}
        >
          <table width="100%">
            <tbody>
              {Object.keys(rawMessage).map((item, index) => {
                const value = rawMessage[item];
                return (
                  <StyledTR key={index} style={{ verticalAlign: 'top' }}>
                    <td>
                      <Typography variant="body1" color="black" key={index}>
                        {item}:
                      </Typography>
                    </td>
                    <StyledTD>
                      <Typography variant="body2" color="black" key={index}>
                        {(value as any).toString()}
                      </Typography>
                    </StyledTD>
                  </StyledTR>
                );
              })}
            </tbody>
          </table>
        </Box>

        <Typography variant="body1" color="black">
          This message will be encoded into:
        </Typography>
        <Box
          component="div"
          sx={{ width: '100%', background: '#F3F4F4', borderRadius: 1, p: '12px' }}
        >
          <Typography variant="body1" color="black">
            Message:
          </Typography>
          <Typography variant="body2" color="black" sx={{ wordBreak: 'break-word' }}>
            {encodedMessage}
          </Typography>
        </Box>
        {/* <Typography variant="body1" color="black">
          Learn more how the encoded works, please check{' '}
          <a href="" target="_blank">
            {'here >'}
          </a>
        </Typography> */}
        <Divider sx={{ width: '100%', my: 1 }} />

        <Box
          component="div"
          display="flex"
          flexDirection="row"
          alignItems="space-around"
          width={'100%'}
          mb={3}
        >
          <Box component="div" sx={{ width: '100%' }}>
            <Typography variant="body1" color="black">
              Gas fee
            </Typography>
            <Typography variant="body2" color="black">
              Estimate gas fee
            </Typography>
            {isInsufficientBalance && (
              <Typography variant="body1" color="error.dark">
                You do not have enough XRP to cover gas fee
              </Typography>
            )}
          </Box>
          <Typography
            variant="body1"
            color="black"
            sx={{ lineHeight: '44px', width: '50%', textAlign: 'right', color: '#0057FF' }}
          >
            {gasFee}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={onContinue}
          disabled={pending || isInsufficientBalance}
        >
          Continue
        </Button>
      </Box>
    </Modal>
  );
};

export default SignatureConfirmModal;
