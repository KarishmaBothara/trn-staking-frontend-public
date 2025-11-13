import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ValidatorNamesDev, ValidatorNamesProd } from 'common/validator-name';
import * as ethers from 'ethers';
import { networks, porcini, root } from 'rootnameservice';
import appConfig from 'utils/appConfig';
import { useAuth } from '@futureverse/auth-react';

export default function useValidatorRnsNames(names: string[]) {
  const { userSession } = useAuth();

  const provider = useMemo(() => {
    if (!userSession) return;

    const config =
      userSession.chainId == porcini.id
        ? { url: porcini.rpcUrls.default.http[0], network: networks.porcini }
        : { url: root.rpcUrls.default.http[0], network: networks.root };

    const provider = new ethers.providers.JsonRpcProvider(config.url, config.network);

    return provider;
  }, [userSession]);

  const { data: record } = useQuery({
    queryKey: [`rnsNames/${names.join(',')}`],
    queryFn: async () => {
      if (!provider) return;
      if (names.length == 0) return;

      const validatorNames = ['development', 'staging', 'uat'].includes(appConfig().stage)
        ? ValidatorNamesDev
        : ValidatorNamesProd;

      const modifiedAddresses = await Promise.all(
        names.map(async (value) => {
          const rnsname = await provider.lookupAddress(value);
          if (rnsname) {
            return rnsname;
          } else if (validatorNames[value]) {
            return validatorNames[value];
          } else {
            return value;
          }
        })
      );

      const addressRecord = modifiedAddresses.reduce((acc, item, indx) => {
        acc[names[indx]] = item;
        return acc;
      }, {} as Record<string, string>);

      return addressRecord;
    },
    enabled: !!provider,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return record;
}
