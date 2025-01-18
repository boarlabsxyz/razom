import type { NextApiRequest, NextApiResponse } from 'next';

import { createMocks } from 'node-mocks-http';
import handler from './posts';
import { keystoneContext } from 'keystone/context';

jest.mock('keystone/context', () => ({
  keystoneContext: {
    query: {
      Post: {
        findMany: jest.fn(),
      },
    },
  },
}));

describe('API Handler: GET /api/handler', () => {
  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
    });

    req.env = process.env;

    await handler(req, res);

    expect(res.statusCode).toBe(405);
    expect(res._getJSONData()).toEqual({ error: 'Method not allowed' });
  });

  it('should return posts for GET requests', async () => {
    (keystoneContext.query.Post.findMany as jest.Mock).mockResolvedValue([
      {
        id: '1',
        title: 'Test Post',
        content: {
          document: 'Test Content',
        },
      },
    ]);

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual([
      {
        id: '1',
        title: 'Test Post',
        content: {
          document: 'Test Content',
        },
      },
    ]);
  });

  it('should return 500 if an error occurs', async () => {
    (keystoneContext.query.Post.findMany as jest.Mock).mockRejectedValue(
      new Error('Database error'),
    );

    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getJSONData()).toEqual({ error: 'Failed to fetch posts' });

    consoleErrorMock.mockRestore();
  });
});
