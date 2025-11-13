import { Button, IconFont, IconFontName, Typography } from '@futureverse/component-library';
import React, { ComponentProps } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type ControlButtonProps = {
  title?: string;
  isLoading?: boolean;
  disabled?: boolean;
  hide?: boolean;
  buttonVariant?: ComponentProps<typeof Button>['variant'];
  onAction: () => unknown;
};

export type ModalLayoutControls = {
  submit?: ControlButtonProps;
  cancel?: ControlButtonProps;
  custom?: ControlButtonProps;
};

export type ModalLayoutProps = {
  title: string | JSX.Element;
  icon?: IconFontName;
  children: React.ReactNode;
  controls?: ModalLayoutControls;
};

export function ModalContent({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex', // Equivalent to flex
        width: '100%', // Equivalent to w-full
        flex: 1, // Equivalent to flex-1
        flexDirection: 'column', // Equivalent to flex-col
        overflow: 'hidden', // Equivalent to overflow-hidden
        overflowY: 'auto', // Equivalent to overflow-y-auto
        padding: '1.5rem', // Equivalent to p-6 (1.5rem = 24px)
        [theme.breakpoints.up('md')]: {
          padding: '2rem', // Equivalent to md:p-8 (2rem = 32px)
        },
      }}
    >
      {children}
    </Box>
  );
}

export default function ModalLayout({ title, icon, children, controls }: ModalLayoutProps) {
  const theme = useTheme();
  return (
    <>
      <Box
        component="div"
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          borderWidth: '0px',
          borderBottomWidth: '1px',
          justifyContent: 'space-between',
          borderStyle: 'solid',
          padding: '1.5rem',
        }}
      >
        <Box
          component="div"
          sx={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          {icon && <IconFont name={icon} />}
          {typeof title === 'string' ? (
            <Typography variant="h6" fontWeight={700}>
              {title}
            </Typography>
          ) : (
            title
          )}
        </Box>
      </Box>

      <ModalContent>{children}</ModalContent>

      {((controls?.cancel && !controls.cancel.hide) ||
        (controls?.custom && !controls.custom.hide) ||
        (controls?.submit && !controls.submit.hide)) && (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.dark, // Assuming secondary color is defined in your theme
            borderColor: '#yourBorderColor', // Replace with your actual border color
            display: 'flex',
            width: '100%',
            justifyContent: 'flex-end',
            gap: '0.5rem', // 0.5 rem = 8px
            border: 0,
            borderTop: '1px solid', // Equivalent to border-t border-solid
            padding: '1.5rem', // 1.5 rem = 24px
            [theme.breakpoints.up('md')]: {
              padding: '2rem', // 2 rem = 32px for medium screens and up
            },
          }}
        >
          {controls.cancel && !controls.cancel.hide && (
            <Button
              sx={{
                width: 'fit-content', // Equivalent to w-fit
                flex: 1, // Equivalent to flex-1
                [theme.breakpoints.up('md')]: {
                  flex: 'none', // Equivalent to md:flex-none
                },
              }}
              variant={controls.cancel.buttonVariant ?? 'outlined'}
              onClick={controls.cancel.onAction}
              loading={controls.cancel.isLoading}
              disabled={controls.cancel.disabled}
            >
              {controls.cancel.title ?? 'Cancel'}
            </Button>
          )}
          {controls.custom && !controls.custom.hide && (
            <Button
              sx={{
                width: 'fit-content', // Equivalent to w-fit
                flex: 1, // Equivalent to flex-1
                [theme.breakpoints.up('md')]: {
                  flex: 'none', // Equivalent to md:flex-none
                },
              }}
              variant={controls.custom.buttonVariant ?? 'outlined'}
              onClick={controls.custom.onAction}
              loading={controls.custom.isLoading}
              disabled={controls.custom.disabled}
            >
              {controls.custom.title}
            </Button>
          )}
          {controls.submit && !controls.submit.hide && (
            <Button
              sx={{
                width: 'fit-content', // Equivalent to w-fit
                flex: 1, // Equivalent to flex-1
                [theme.breakpoints.up('md')]: {
                  flex: 'none', // Equivalent to md:flex-none
                },
              }}
              variant={controls.submit.buttonVariant ?? 'contained'}
              onClick={controls.submit.onAction}
              loading={controls.submit.isLoading}
              disabled={controls.submit.disabled}
            >
              {controls.submit.title ?? 'Submit'}
            </Button>
          )}
        </Box>
      )}
    </>
  );
}
