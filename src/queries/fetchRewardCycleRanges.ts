import appConfig from 'utils/appConfig';
import * as t from 'io-ts';

const BlockEraCodec = t.type({
  blockNumber: t.number,
  eraIndex: t.number,
});

const BlockEraArrayCodec = t.array(BlockEraCodec);

export const GET_ACTIVE_ERAS = `
  query GetActiveEras($rewardCycleEraRanges: [Int!]!, $queryLength: Int!) {
    activeEras(
      orderBy: eraIndex_ASC
      where: { eraIndex_in: $rewardCycleEraRanges }
      limit: $queryLength
    ) {
      blockNumber
      eraIndex
    }
  }
`;

export const fetchRewardCycleRanges = async (
  variables?: Record<string, any>
): Promise<Array<{ blockNumber: number; eraIndex: number }> | undefined> => {
  console.log('variables ', variables);
  const response = await fetch(appConfig().votexDBUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_ACTIVE_ERAS,
      variables: variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors.map((e: any) => e.message).join(', '));
  }

  const result = BlockEraArrayCodec.decode(data.data.activeEras);
  if (result._tag === 'Right') {
    return result.right;
  } else {
    console.error('could not decode reward cycles');
    return undefined;
  }
};
