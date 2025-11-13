import { Environment } from '@futureverse/auth';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default () => {
  const fvEnv: Environment = (() => {
    switch (process.env.NEXT_PUBLIC_STAGE) {
      case 'production':
        return 'production';
      case 'staging':
        return 'staging';
      default:
        return 'development';
    }
  })();

  return {
    chain: {
      endpoint: process.env.NEXT_PUBLIC_CHAIN_RPC_ENDPOINT!,
      explorer: process.env.NEXT_PUBLIC_CHAIN_EXPLORER_BASE_URL,
    },
    stage: process.env.NEXT_PUBLIC_STAGE!,
    api: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_API_URL! + '/api',
    },
    archiveDBUrl: process.env.NEXT_PUBLIC_ARCHIVE_DB_API_URL!,
    stakingDuration: Number(process.env.NEXT_PUBLIC_STAKING_DURATION!),
    anyCycleStartDate: process.env.NEXT_PUBLIC_ANY_CYCLE_START_DATE!,
    geckoApiUrl: process.env.NEXT_PUBLIC_GECKO_API_URL!,
    enableMaintenanceMode: process.env.NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE === 'true',
    whiteList: process.env.NEXT_PUBLIC_WHITELIST_GAS_TOKENS ?? '1,2',
    vortexVaultAddress:
      process.env.NEXT_PUBLIC_VORTEX_VAULT_ADDRESS ?? '0x6d6F646C7674782F76706f740000000000000000',
    host: process.env.NEXT_PUBLIC_HOST,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
    fvEnv,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    xamanApiKey: process.env.NEXT_PUBLIC_XAMAN_API_KEY!,
    intercomId: process.env.NEXT_PUBLIC_INTERCOM_ID ?? '',
    intercomSecretKey: process.env.INTERCOM_SECRET_KEY!,
    votexDBUrl: process.env.NEXT_PUBLIC_VORTEX_DB_API_URL!,
    profileSettingURL: process.env.NEXT_PUBLIC_PROFILE_SETTING_URL!,
  };
};
