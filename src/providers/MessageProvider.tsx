import { createContext, useContext, useState } from 'react';

import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material';

import { isString } from 'lodash';

import { Typography } from '@futureverse/component-library';

export enum MessageKey {
  Withdraw = 'withdraw',
  Bond = 'bond',
  BondMore = 'bond-more',
  Unbond = 'unbond',
  Nominate = 'nominate',
  BondAndNomiate = 'bond-and-nominate',
  Rebond = 'rebond',
  WithdrawUnbond = 'withdraw-unbond',
}

export enum MessageType {
  Success = 'success',
  Error = 'error',
}

export interface Message {
  key: MessageKey;
  type: MessageType;
  title?: string;
  message: string | React.ReactNode;
}

interface MessageContextType {
  addMessage: (message: Message) => void;
}

const MessageContext = createContext<MessageContextType>({} as MessageContextType);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleClose = (key: MessageKey) => {
    setMessages((messages) => messages.filter((message) => message.key !== key));
  };

  const addMessage = (message: Message) => {
    setMessages((messages) => [...messages, message]);
  };

  return (
    <MessageContext.Provider value={{ addMessage }}>
      {messages.map((message) => (
        <Snackbar
          key={message.key}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={!!message}
          onClose={() => handleClose(message.key)}
          autoHideDuration={10000} // 10 seconds
          sx={{ borderRadius: 2, position: 'fixed' }}
        >
          <Alert
            severity={message.type}
            onClose={() => handleClose(message.key)}
            sx={{
              alignItems: 'flex-start',
              gap: 3,

              '&.MuiAlert-standardSuccess': {
                backgroundColor: '#E7FFEA !important',
              },

              '&.MuiAlert-standardError': {
                backgroundColor: '#FFEAEA !important',
              },

              '& .MuiAlertTitle-root': {
                fontWeight: 700,
              },

              '& .MuiAlert-icon': {
                color: 'primary.dark',
              },

              '& .MuiAlert-action': {
                color: 'primary.dark',
              },
            }}
          >
            <AlertTitle sx={{ color: 'primary.dark' }}>
              {message.title || message.type === MessageType.Success
                ? 'Transaction successful'
                : 'Transaction failed'}
            </AlertTitle>
            {isString(message.message) ? (
              <Typography variant="caption" color="primary.dark">
                {message.message}
              </Typography>
            ) : (
              message.message
            )}
          </Alert>
        </Snackbar>
      ))}

      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }

  return context;
};

export default MessageProvider;
