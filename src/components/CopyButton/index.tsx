import { Box } from '@mui/material';
import * as React from 'react';

export type CopyButtonProps = {
  didCopy?: boolean;
  value: string;
  sx?: any;
  onlyIconChange?: boolean;
  showTooltip?: boolean;
  onBypass?: () => void;
  children: React.ReactNode;
};

const CopyButton: React.ComponentType<CopyButtonProps> = ({
  value,
  children,
  onBypass,
  sx,
  ...rest
}) => {
  const [copied, setCopied] = React.useState(() => {
    return rest.didCopy ?? false;
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onBypass?.();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Box
      onClick={handleCopy}
      sx={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
    >
      {children}
      {copied ? (
        <span style={{ marginLeft: 4 }} className="material-symbols-outlined">
          {'check_circle'}
        </span>
      ) : (
        <span style={{ marginLeft: 4 }} className="material-symbols-outlined">
          {'content_copy'}
        </span>
      )}
    </Box>
  );
};

export default CopyButton;
