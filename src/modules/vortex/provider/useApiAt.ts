import { useEffect, useMemo, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { useTrnApi } from '@futureverse/transact-react';

export const useApiAt = () => {
  const { trnApi } = useTrnApi();
  const [apiAt, setApiAt] = useState<ApiPromise>(undefined as any);

  useEffect(() => {
    (async () => {
      if (trnApi?.isReady) {
        const { parentHash } = await trnApi.rpc.chain.getHeader();

        const localApiAt = await trnApi.at(parentHash);
        setApiAt(localApiAt as any);
      }
    })();
  }, [trnApi]);

  const isApiReady = trnApi?.isReady && !!apiAt;

  return useMemo(() => ({ api: apiAt, isApiReady }), [apiAt, isApiReady]);
};
