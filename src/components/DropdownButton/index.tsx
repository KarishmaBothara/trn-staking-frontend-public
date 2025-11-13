import { useState } from 'react';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Box, Menu, MenuItem } from '@mui/material';

import { Button } from '@futureverse/component-library';

interface Item<T> {
  id: T;
  value: string;
}

interface IProps<T> {
  text: string;
  items: Item<T>[];
  selectedId: string;
  onChange: (selectedItem: T) => void;
}

function DropdownButton<T = string>({ text, items, selectedId, onChange }: IProps<T>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (item: Item<T>) => {
    onChange(item.id);
    handleClose();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        startIcon={<SwapVertIcon />}
        onClick={handleClick}
      >
        {text}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleChange(item)}
            sx={{
              fontWeight: 700,
              ...(selectedId === item.id
                ? {
                    backgroundColor: 'primary.main',
                    color: 'primary.dark',
                  }
                : {
                    backgroundColor: 'secondary.dark',
                    color: 'secondary.light',
                  }),
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'primary.dark',
              },
            }}
          >
            {item.value}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default DropdownButton;
