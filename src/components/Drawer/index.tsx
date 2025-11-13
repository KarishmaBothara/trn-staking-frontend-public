import React, { PropsWithChildren } from 'react';

import { Box, Divider, DrawerProps, Drawer as MuiDrawer } from '@mui/material';

import { IconButton, IconFont, Typography } from '@futureverse/component-library';

type Props = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  buttonsBar?: React.ReactNode;
  HeaderContents?: React.ReactNode;
  hasTopDivider?: boolean;
  hasBottomDivider?: boolean;
};

export const Drawer = ({
  open,
  title,
  buttonsBar,
  HeaderContents,
  hasTopDivider,
  hasBottomDivider,
  onClose,
  children,
  ...props
}: PropsWithChildren<Props & DrawerProps>): JSX.Element => {
  return (
    <MuiDrawer
      open={open}
      onClose={onClose}
      variant="persistent"
      anchor="bottom"
      PaperProps={{
        style: {
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          height: '90%',
        },
      }}
      {...props}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={hasTopDivider ? 2 : 4}
        sx={{ height: '100%' }}
      >
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            px: { xs: 3, md: 9 },
            pt: { xs: 3, md: 4 },
            pd: { xs: 2, md: 3 },
          }}
        >
          <Box
            display="flex"
            alignItems={'center'}
            sx={{
              position: 'relative',
              height: 48,
            }}
          >
            {HeaderContents}
            {onClose != null && (
              <IconButton
                variant="text"
                color="primary"
                onClick={onClose}
                sx={{
                  display: 'flex',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  alignSelf: 'flex-end',
                  width: 3,
                  p: 0,
                }}
              >
                <IconFont name="close" fontSize={24} />
              </IconButton>
            )}
          </Box>
          {title && <Typography variant="h3">{title}</Typography>}
        </Box>
        {hasTopDivider && <Divider />}
        <Box
          sx={{
            height: '100%',
            pt: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Box>
        {hasBottomDivider && <Divider className="flex md:hidden" />}
        {buttonsBar && (
          <Box
            display="flex"
            alignItems={'flex-end'}
            justifyContent="flex-end"
            sx={{
              width: '100%',
              py: { xs: 3, md: 4 },
              px: { xs: 3, md: 9 },
              gap: { xs: 2, md: 4 },
              flexDirection: { xs: 'column-reverse', md: 'row' },
              position: 'absolute',
              bottom: 0,
            }}
          >
            {buttonsBar}
          </Box>
        )}
      </Box>
    </MuiDrawer>
  );
};

export default Drawer;
