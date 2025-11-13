import { gql } from '@apollo/client';

export const GET_VORTEX_PAID_OUT = gql`
  query GetVortexPaidOut($futurepass: String!) {
    archive {
      event(
        where: {
          name: { _eq: "VortexDistribution.VtxDistPaidOut" }
          args: { _contains: { who: $futurepass } }
        }
        order_by: { block_id: desc, block: {} }
      ) {
        block {
          height
          hash
          extrinsics {
            calls {
              now: args(path: "now")
            }
          }
        }
        args
      }
    }
  }
`;
