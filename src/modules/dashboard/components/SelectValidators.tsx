import { Box } from '@mui/material';

import { useDeposit } from '../../shared/providers/DepositProvider';
import { Typography } from '@futureverse/component-library';
import ExternalLink from 'components/ExternalLink';
import ValidatorList from 'modules/validators/components/ValidatorList';

const SelectValidators = () => {
  const { selectedValidators, selectValidator, error } = useDeposit();

  return (
    <>
      <Typography variant="h5" fontWeight={700}>
        Nominate validators
      </Typography>

      <Typography
        variant="body1"
        fontWeight={700}
        color={'secondary.light'}
        sx={{ maxWidth: 343, mt: 2 }}
      >
        Nominating earns proportional share of 100% of the Reward pool. If you choose to skip
        nomination you will only earn proportional share of 30% of the Reward pool.
      </Typography>

      <Box sx={{ my: 3 }}>
        <ExternalLink
          href="https://docs.therootnetwork.com/learn/staking-protocol#nominating"
          content="What is nomination?"
        />
      </Box>

      <ValidatorList
        heading="Select validators"
        selectedValidators={selectedValidators}
        onSelectValidator={selectValidator}
        error={error.nomination}
      />
    </>
  );
};

export default SelectValidators;
