export enum IncludeFilters {
  Active = 'active',
  MyNominations = 'My Nominations',
}

export enum ExcludeFilters {
  Oversubscribed = 'over',
}

export const VALIDATORS_PAGE_SIZE = 10;

export type IFilter = Record<IncludeFilters | ExcludeFilters, boolean>;

export const COMMISSION_BASE = 1e7;
