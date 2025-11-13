import { useMemo } from 'react';

import { Box, Card } from '@mui/material';

import { Button, Typography } from '@futureverse/component-library';
import OpenPositionButton from 'components/OpenPositionButton';
import useNominator from 'hooks/useNominator';
import useStakingStatus from 'hooks/useStakingStatus';
import UnbondValue from 'modules/unbond';
import { useFuturePassAccountAddress } from 'hooks/useFuturePassAccountAddress';

type PositionType = 'stake' | 'nominated';

interface PositionCardProps {
  rootBalance: string;
  flatValue: string;
  availableRoot: string;
  positionType: PositionType;
  onOpenPosition?: () => void;
  onRemovePosition?: () => void;
}

const PositionCard = ({
  rootBalance,
  flatValue,
  availableRoot,
  positionType,
  onOpenPosition,
  onRemovePosition,
}: PositionCardProps) => {
  const { data: futurePassAddress } = useFuturePassAccountAddress();
  const stakingStatus = useStakingStatus(futurePassAddress || '');
  const nominator = useNominator(futurePassAddress || '');

  const hasUnbondingValue = useMemo(() => {
    const unlocking = stakingStatus?.unlocking as any[];
    if (unlocking && unlocking.length <= 0) {
      return false;
    }
    return true;
  }, [stakingStatus]);

  const isANominator = useMemo(() => {
    return !nominator;
  }, [nominator]);

  return (
    <Card
      sx={{
        padding: 3,
        color: 'primary.main',
        backgroundColor: '#121212',
        height: 344,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Typography variant="overline" color="text.secondary">
        {positionType} position
      </Typography>

      <Box display="flex" alignItems="flex-end" gap={1} mb={5}>
        <Typography variant="h3">R{rootBalance} </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          /${flatValue}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="overline" color="text.secondary">
          available root
        </Typography>
        <Typography variant="subtitle2">R{availableRoot}</Typography>
      </Box>

      <OpenPositionButton onClick={onOpenPosition}>
        <Typography variant={'body1'} color="primary.main">
          Open {positionType === 'stake' ? 'Stake' : 'Nomination'} Position
        </Typography>
      </OpenPositionButton>

      <Button
        variant="outlined"
        size="large"
        sx={{
          width: '100%',
          borderRadius: 1,
          borderColor: 'secondary.light',
          justifyContent: 'flex-start',
        }}
        onClick={onRemovePosition}
      >
        Remove {positionType === 'stake' ? 'Stake' : 'Nominated'} Position
      </Button>
      {hasUnbondingValue && isANominator && positionType === 'nominated' && <UnbondValue />}
      {hasUnbondingValue && positionType === 'stake' && <UnbondValue />}
    </Card>
  );
};

export default PositionCard;
