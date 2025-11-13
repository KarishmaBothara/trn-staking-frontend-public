import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IntercomUserHashResponse } from 'common/types';
import { ENVIRONMENTS } from '@futureverse/auth';
import appConfig from 'utils/appConfig';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IntercomUserHashResponse>
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    return res.status(401).json({
      userHash: null,
      error: 'Authorization header missing or malformed',
    });
  }

  const stage = appConfig().stage as 'production' | 'staging' | 'development';

  try {
    const response = await fetch(`${ENVIRONMENTS[stage].idpURL}/me`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        userHash: null,
        error: `Failed to fetch user data: ${response.statusText}`,
      });
    }

    const { futurepass } = await response.json();

    if (!futurepass) {
      return res.status(400).json({
        userHash: null,
        error: 'Missing FuturePass in response',
      });
    }

    return res.status(200).json({
      userHash: crypto
        .createHmac('sha256', appConfig().intercomSecretKey)
        .update(futurepass)
        .digest('hex'),
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      userHash: null,
      error: 'Server error',
    });
  }
}
