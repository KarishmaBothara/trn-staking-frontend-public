import React, { PropsWithChildren } from 'react';

import { Box, DrawerProps } from '@mui/material';

type Props = {
  buttonsBar?: React.ReactNode;
};

export const DrawerContent = ({
  buttonsBar,
  children,
}: PropsWithChildren<Props & DrawerProps>): JSX.Element => {
  const btnBarRef = React.useRef<HTMLDivElement>(null);

  const minHeight = React.useMemo(() => {
    return `calc(100% - ${
      buttonsBar && btnBarRef.current?.clientHeight ? btnBarRef.current?.clientHeight : 108
    }px)`;
  }, [buttonsBar]);

  return (
    <>
      <Box
        sx={{
          px: { xs: 3, md: 9 },
          minHeight,
        }}
      >
        {children}
      </Box>
      {buttonsBar && (
        <Box
          ref={btnBarRef}
          display="flex"
          alignItems={'flex-end'}
          justifyContent="flex-end"
          sx={{
            width: '100%',
            py: { xs: 1, md: 2 },
            px: { xs: 3, md: 9 },
            gap: { xs: 2, md: 4 },
            flexDirection: { xs: 'column-reverse', md: 'row' },
            backgroundColor: 'primary.dark',
            position: 'sticky',
            bottom: 0,
          }}
        >
          {buttonsBar}
        </Box>
      )}
    </>
  );
};

export default DrawerContent;
