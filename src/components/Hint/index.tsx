import React, { ReactNode } from 'react';

import HelpIcon from '@mui/icons-material/Help';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

export type HintProps = {
  text: React.ReactNode;
  children?: ReactNode;
};

const Hint: React.FC<HintProps> = (props) => {
  const { text, children } = props;

  if (!text) {
    return <>{children}</>;
  }

  return (
    <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.5}>
      <span>{children}</span>
      <Tooltip placement="top-start" title={text} sx={{ alignSelf: 'start', cursor: 'pointer' }}>
        <Box component="div" sx={{ height: 20 }}>
          <HelpIcon fontSize="small" color="primary" />
        </Box>
      </Tooltip>
    </Stack>
  );
};

export default Hint;
