import { Box, List } from '@mui/material';

import { useState } from 'react';

import useValidators from '../../../providers/ValidatorsProvider';
import { Typography } from '@futureverse/component-library';
import { BN } from '@polkadot/util';
import Pagination from 'components/Pagination';
import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from 'components/Table';
import {
  COMMISSION_BASE,
  IncludeFilters,
  VALIDATORS_PAGE_SIZE,
} from 'modules/shared/components/ValidatorFilterDrawer/types';

import ValidatorListHeader from './ValidatorListHeader';
import ValidatorListItem from './ValidatorListItem';
import useValidatorRnsNames from 'hooks/useValidatorRnsNames';

interface IProps {
  heading?: string;
  showHeader?: boolean;
  selectedValidators?: string[];
  onSelectValidator?: (validator: string) => void;
  error?: string;
}

const ValidatorList = ({
  heading,
  showHeader = true,
  selectedValidators,
  onSelectValidator,
  error,
}: IProps) => {
  const { validators, allValidators, filter, total, page, setPage, oldValidators } =
    useValidators();

  const totalCount = total + oldValidators.length;
  const count = Math.ceil(totalCount / VALIDATORS_PAGE_SIZE);
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const rnsMapState = useValidatorRnsNames(allValidators.map((item) => item.stashId));

  return (
    <Box>
      {showHeader && <ValidatorListHeader heading={heading} />}

      <Table sx={{ width: { xs: '200%', md: '100%' }, mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>validators</TableHeaderCell>
            <TableHeaderCell>status</TableHeaderCell>
            <TableHeaderCell>number of nominators</TableHeaderCell>
            <TableHeaderCell>total root nominated</TableHeaderCell>
            <TableHeaderCell>validator commission</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rnsMapState &&
            validators &&
            validators.map((validator) => {
              return (
                <ValidatorListItem
                  key={validator.stashId}
                  address={validator.stashId}
                  status={validator.status}
                  commission={validator.commission / COMMISSION_BASE || 0}
                  totalStake={validator.exposure?.total as BN}
                  nominators={validator.exposure?.others?.length || 0}
                  validatorNames={rnsMapState}
                  isSelected={selectedValidators?.includes(validator.stashId)}
                  onSelect={onSelectValidator}
                  isOversubscribed={validator.isOverSubscribed}
                />
              );
            })}
          {/*Display inactive validators on last page*/}
          {!filter[IncludeFilters.Active] &&
            count === page &&
            rnsMapState &&
            oldValidators &&
            oldValidators.map((validator) => {
              return (
                <ValidatorListItem
                  key={validator}
                  address={validator}
                  status={'Offline'}
                  commission={0}
                  totalStake={new BN(0)}
                  nominators={0}
                  validatorNames={rnsMapState}
                  isSelected={selectedValidators?.includes(validator)}
                  onSelect={onSelectValidator}
                  isOversubscribed={false}
                />
              );
            })}
        </TableBody>
      </Table>
      <Pagination count={count} page={page} onChange={handleChange} />
      {error && (
        <Box sx={{ color: 'red' }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ValidatorList;
