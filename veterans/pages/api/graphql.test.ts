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
      json: jest.fn().mockResolvedValue({ data: 'mocked-data' }),
    };

    (createYoga as jest.Mock).mockImplementation(({ context }) => {
      return (req: NextApiRequest, res: NextApiResponse) => {
        context({ req, res });
        res.statusCode = 200;
        res.json({ data: 'mocked-data' });
      };
    });
  });

  it('should create a Yoga API with keystoneContext and handle the request', async () => {
    const queryType = new GraphQLObjectType({
      name: 'Query',
      fields: {
        hello: {
          type: GraphQLString,
          resolve: () => 'Hello, world!',
        },
      },
    });

    const schema = new GraphQLSchema({
      query: queryType,
    });

    const yogaApi = createYoga({
      graphqlEndpoint: '/api/graphql',
      schema,
      context: ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) =>
        keystoneContext.withRequest(req, res),
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
});
