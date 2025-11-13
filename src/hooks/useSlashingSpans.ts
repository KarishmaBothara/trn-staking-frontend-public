import { useTrnApi } from '@futureverse/transact-react';
import { createNamedHook } from './createNamedHook';
import { useCall } from './useCall';

const OPT_SPAN = {
  transform: (optSpans: any): number => (optSpans.isNone ? 0 : optSpans.unwrap().prior.length + 1),
};

function useSlashingSpansImpl(stashId?: string | null): number {
  const { trnApi } = useTrnApi();

  const slashingSpan = useCall<number>(
    trnApi && trnApi.query.staking.slashingSpans,
    [stashId],
    OPT_SPAN
  );

  return slashingSpan || 0;
}

export default createNamedHook('useSlashingSpans', useSlashingSpansImpl);
