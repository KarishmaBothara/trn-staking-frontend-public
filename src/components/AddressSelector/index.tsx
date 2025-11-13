import Identicon from 'react-blockies';

import { List, ListItem } from '@mui/material';

import { Typography } from '@futureverse/component-library';
import { Validator } from 'common/types';
import { shortenAddr } from 'utils/format-utils';

interface IProps {
  validators: Validator[];
  onSelect: (address: string) => void;
}

const AddressSelector = ({ validators, onSelect }: IProps) => {
  return (
    <List
      sx={{
        backgroundColor: 'primary.dark',
        borderWidth: '1px',
        borderColor: 'secondary.dark',
        borderStyle: 'solid',
        borderRadius: 1,
        width: '100%',
        minHeight: 240,
        maxHeight: 240,
        p: 0.5,
        overflowY: 'auto',
      }}
    >
      {validators.map((validator) => (
        <ListItem
          key={validator.stashId}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'secondary.light',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'secondary.dark',
              borderRadius: 0.5,
            },
          }}
          onClick={() => onSelect(validator.stashId)}
        >
          <Identicon seed={validator.stashId} size={6} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {shortenAddr(validator.stashId)}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};

export default AddressSelector;
