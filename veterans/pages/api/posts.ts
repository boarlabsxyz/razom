import { keystoneContext } from 'keystone/context';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posts = await keystoneContext.query.Post.findMany({
      query: `
        id
        title
        content {
          document
        }
      `,
    });

    res.status(200).json(posts);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
