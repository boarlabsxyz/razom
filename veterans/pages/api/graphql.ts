import { type NextApiRequest, type NextApiResponse } from 'next';

import { createYoga } from 'graphql-yoga';

import { keystoneContext } from '../../keystone/context';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: '/api/graphql',
  schema: keystoneContext.graphql.schema,
  context: ({ req, res }) => keystoneContext.withRequest(req, res),
});
