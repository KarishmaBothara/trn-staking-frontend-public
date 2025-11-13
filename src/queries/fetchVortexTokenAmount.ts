import { gql } from '@apollo/client';

export const GET_REDEEM_TOKENS_FROM_VAULT_EXTRINSIC = gql`
  query GetBurnEvent($futurepass: String!) {
    archive {
      event(
        where: {
          name: { _eq: "Assets.Burned" }
          args: { _contains: { owner: $futurepass, assetId: 3 } }
        }
        order_by: { block_id: desc, block: {} }
      ) {
        args
        block {
          height
          extrinsics {
            calls {
              now: args(path: "now")
            }
          }
        }
      }
    }
  }
`;
