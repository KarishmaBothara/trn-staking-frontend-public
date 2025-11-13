import { useTrnApi } from '@futureverse/transact-react';
import { useMemo } from 'react';

import { useCall } from './useCall';

const useValidatorInfo = (validators: string[]) => {
  const { trnApi } = useTrnApi();

  const validatorInfo: any = useCall(
    trnApi && validators.length > 0 && trnApi.query.staking.validators.multi,
    [validators]
  );

  const info = useMemo(() => {
    if (validatorInfo) {
      return validators.map((item, index) => {
        const info = validatorInfo[index]?.toHuman() ?? {};
        return {
          validator: item,
          commission: info.commission,
          blocked: info.blocked,
        };
      });
    }

    return [];
  }, [validatorInfo, validators]);

  return info;
};

export default useValidatorInfo;
