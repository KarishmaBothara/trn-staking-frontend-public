export enum RedeemStage {
  START = 'START',
  TOKENS = 'TOKENS',
  CONFIRMATION = 'CONFIRMATION',
}

export interface IRewardRedeemHistory {
  account: string;
  blockNumber: number;
  type: 'Reward' | 'Redeem';
  timestamp: string;
  cycleId: string;
  amount?: number;
}

export interface IRewardRedeemHistoryResponse {
  data: IRewardRedeemHistory[];
  totalCount: number;
}

export interface RedeemAsset {
  asset: string;
  amount: number;
  composition: number;
}
