import * as React from 'react';

import Link from 'next/link';

import { Box, Menu, MenuItem } from '@mui/material';

import { Button, Typography } from '@futureverse/component-library';

interface NavButtonProps {
  href: string;
  name: string;
  selected: boolean;
  disabled?: boolean;
  subItems?: { href: string; name: string; selected: boolean }[];
}

const NavButton = ({ href, name, selected, disabled = false, subItems }: NavButtonProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (subItems && subItems.length > 0) {
    return (
      <Box>
        <Button
          color={selected ? 'primary' : 'secondary'}
          variant="text"
          disabled={disabled}
          onClick={handleClick}
        >
          <Typography variant="body1">{name}</Typography>
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {subItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <MenuItem
                onClick={handleClose}
                sx={{
                  border: item.selected ? '1px solid' : 'none',
                  borderColor: 'primary.secondary',
                  borderRadius: 1,
                }}
              >
                <Typography variant="overline">{item.name}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    );
  }

  return (
    <Link href={href}>
      <Button color={selected ? 'primary' : 'secondary'} variant="text" disabled={disabled}>
        <Typography variant="body1">{name}</Typography>
      </Button>
    </Link>
  );
};

export default NavButton;
