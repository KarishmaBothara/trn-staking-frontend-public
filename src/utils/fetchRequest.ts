import appConfig from './appConfig';

export const fetchRequest = async (input: RequestInfo, init?: RequestInit) => {
  let response;
  let error;
  try {
    const res = await fetch(input, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...init,
    });
    if (res.status !== 204) {
      response = await res.json();
    } else {
      response = { statusCode: 204 };
    }
    if (!res.ok) {
      error = 'request failed';
    }
  } catch (err) {
    console.error('Send request error', err);
    error = err;
  }
  return { response, error };
};

export const PAGE_SIZE = 10;

export const fetchVortexRanking = async () => {
  return fetchRequest(`${appConfig().geckoApiUrl}/ranking`);
};

export const fetchVortexValut = async () => {
  return fetchRequest(`${appConfig().geckoApiUrl}/vortex_vault`);
};
