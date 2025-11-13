import { useAuth } from '@futureverse/auth-react';

export const useFuturePassAccountAddress = () => {
  const { userSession, isFetchingSession } = useAuth();

  return { data: userSession?.futurepass ?? null, isLoading: isFetchingSession };
};
