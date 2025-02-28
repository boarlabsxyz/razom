import { type NextApiRequest, type NextApiResponse } from 'next';

import { createYoga } from 'graphql-yoga';

import { keystoneContext } from 'keystone/context';

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedOrigins = (origin: string | undefined) => {
  if (!origin) {
    // return false;
    return true;
  }

  return (
    origin.includes('localhost:3000') ||
    origin.includes('localhost:8000') ||
    origin.endsWith('.vercel.app')
  );
};

const corsOptions = {
  origin: ((
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: string | boolean) => void,
  ) => {
    if (allowedOrigins(requestOrigin)) {
      callback(null, requestOrigin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }) as unknown as string | string[],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: '/api/graphql',
  schema: keystoneContext.graphql.schema,
  context: ({ req, res }) => keystoneContext.withRequest(req, res),
  cors: corsOptions,
});
