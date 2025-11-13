import { useCallback, useEffect, useState } from 'react';

import { Box, FormHelperText } from '@mui/material';

import { Button } from '@futureverse/component-library';
import DrawerContent from 'components/Layout/DrawerContent';
import Select from 'components/Select';
import useAssets, { AssetInfo } from 'hooks/useAssets';
import { useDeposit } from 'modules/shared/providers/DepositProvider';
import ValidatorList from 'modules/validators/components/ValidatorList';
import { useNomination } from 'providers/NominationProvider';
import { useRootTransaction } from 'providers/RootTransactionProvider';
import useValidators from 'providers/ValidatorsProvider';
import { IncludeFilters } from 'modules/shared/components/ValidatorFilterDrawer/types';

import { ChangeNominationStage } from '../type';
import { useTrnApi } from '@futureverse/transact-react';

const ChangeNominatorPanel = () => {
  const { trnApi } = useTrnApi();
  const { filteredNominations, unfilteredUnpaginatedNominations } = useNomination();
  const { filter } = useValidators();
  const { assets, selectedAsset } = useAssets();

  const [updatedValidators, setUpdatedValidators] = useState<string[]>(
    filteredNominations.map((n) => n.validator)
  );
  const [error, setError] = useState<string>();

  const { setChangeNominationStage, setSelectedValidators } = useDeposit();
  const { confirmToNominate, confirmToChill, handleSetGasToken, gasToken } = useRootTransaction();

  const maxNominations = Number(trnApi && trnApi.consts.staking.maxNominations.toString());

  useEffect(() => {
    if (filter[IncludeFilters.Active]) {
      setUpdatedValidators(filteredNominations.map((n) => n.validator));
    } else if (filter[IncludeFilters.MyNominations]) {
      setUpdatedValidators(unfilteredUnpaginatedNominations.map((n) => n.validator));
    }
  }, [filter, unfilteredUnpaginatedNominations, filteredNominations]);

  const handleSelectValidator = useCallback(
    (validator: string) => {
      setError(undefined);
      if (updatedValidators.includes(validator)) {
        setUpdatedValidators(updatedValidators.filter((v) => v !== validator));
      } else {
        if (updatedValidators.length >= maxNominations) {
          setError('The amount of nomination cannot exceed the allowed maximum nominations.');
          return;
        }
        setUpdatedValidators([...updatedValidators, validator]);
      }
    },
    [updatedValidators, maxNominations]
  );

  const handleConfirm = useCallback(async () => {
    setSelectedValidators(updatedValidators);
    if (updatedValidators.length <= 0) {
      await confirmToChill();
    } else {
      await confirmToNominate(updatedValidators);
    }
    setChangeNominationStage(ChangeNominationStage.CONFIRMATION);
  }, [
    confirmToChill,
    confirmToNominate,
    setChangeNominationStage,
    setSelectedValidators,
    updatedValidators,
  ]);

  const handleGasPayment = useCallback(
    (value: AssetInfo) => {
      handleSetGasToken(value);
    },
    [handleSetGasToken]
  );

  return (
    <DrawerContent
      buttonsBar={
        <Box display="flex" gap={1} width="400px">
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
            <Select
              label="GAS PAYMENT"
              defaultGas={selectedAsset}
              menuItems={assets}
              onChange={handleGasPayment}
              ariaLabel="Select gas payment"
              sx={{
                backgroundColor: '#000',
                color: '#FFF',
                '&:hover': {
                  backgroundColor: '#FFF',
                  color: '#000',
                  outline: 'none',
                  '&.MuiInputBase-root > .MuiSelect-icon': {
                    color: '#000',
                  },
                },
                '&.Mui-focused': {
                  border: 'none',
                },
                '&.MuiInputBase-root': {
                  border: '1px solid #FFF',
                },
                width: '10rem',
                height: '2.55rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginRight: '1rem',
                borderRadius: '3rem',
              }}
            />
            <Box sx={{ paddingLeft: 3 }}>
              <FormHelperText sx={{ color: 'white' }}>GAS PAYMENT</FormHelperText>
            </Box>
          </Box>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm selection
          </Button>
        </Box>
      }
    >
      <ValidatorList
        heading="Select validators to nominate"
        selectedValidators={updatedValidators}
        onSelectValidator={handleSelectValidator}
        error={error}
      />
    </DrawerContent>
  );
};

export default ChangeNominatorPanel;
