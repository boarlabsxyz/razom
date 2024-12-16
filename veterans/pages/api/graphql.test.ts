import { NextApiRequest, NextApiResponse } from 'next';
import { createYoga } from 'graphql-yoga';
import { keystoneContext } from '../../keystone/context';
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

jest.mock('graphql-yoga', () => ({
  createYoga: jest.fn(),
}));

jest.mock('../../keystone/context', () => ({
  keystoneContext: {
    graphql: { schema: {} },
    withRequest: jest.fn(),
  },
}));

const createTestSchema = () => {
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello, world!',
      },
    },
  });
  return new GraphQLSchema({ query: queryType });
};

describe('GraphQL API Route', () => {
  let mockRequest: Partial<NextApiRequest>;
  let mockResponse: Partial<NextApiResponse>;

  beforeEach(() => {
    mockRequest = {
      method: 'POST',
      body: '{}',
      headers: { 'content-type': 'application/json' },
    };
    mockResponse = {
      statusCode: 200,
      json: jest.fn(),
    };

    (createYoga as jest.Mock).mockImplementation(() => {
      return async (req: NextApiRequest, res: NextApiResponse) => {
        // const ctx = context({ req, res });
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.json({
            errors: [{ message: 'Method not allowed' }],
          });
        } else {
          res.statusCode = 200;
          res.json({ data: 'mocked-data' });
        }
      };
    });
  });

  it('should create a Yoga API and handle POST requests', async () => {
    const yogaApi = createYoga({
      graphqlEndpoint: '/api/graphql',
      schema: createTestSchema(),
      context: ({
        req,
        res,
      }: {
        req: NextApiRequest;
        res: NextApiResponse;
      }) => ({
        ...keystoneContext.withRequest(req, res),
        req,
        res,
      }),
    });

    await yogaApi(
      mockRequest as NextApiRequest,
      mockResponse as NextApiResponse,
    );

    expect(keystoneContext.withRequest).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
    );

    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: 'mocked-data' });
  });

  it('should handle invalid requests (non-POST)', async () => {
    mockRequest.method = 'GET';

    const yogaApi = createYoga({
      graphqlEndpoint: '/api/graphql',
      schema: createTestSchema(),
      context: ({
        req,
        res,
      }: {
        req: NextApiRequest;
        res: NextApiResponse;
      }) => ({
        ...keystoneContext.withRequest(req, res),
        req,
        res,
      }),
    });

    await yogaApi(
      mockRequest as NextApiRequest,
      mockResponse as NextApiResponse,
    );

    expect(mockResponse.statusCode).toBe(405);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            message: 'Method not allowed',
          }),
        ]),
      }),
    );
  });
});
