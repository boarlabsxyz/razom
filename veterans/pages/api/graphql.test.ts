import { makeExecutableSchema } from '@graphql-tools/schema';

const mockWithRequest = jest.fn(() => ({ user: 'mock-user' }));
jest.mock('keystone/context', () => {
  const typeDefs = `
      type Query {
        _empty: String
        }
        `;
  const mockSchema = makeExecutableSchema({ typeDefs });

  return {
    keystoneContext: {
      graphql: {
        schema: mockSchema,
      },
      withRequest: mockWithRequest,
    },
  };
});

import { keystoneContext } from 'keystone/context';
import { config } from './graphql';

describe('/api/graphql API handler', () => {
  it('should have the correct API snd schema configuration', () => {
    expect(config.api.bodyParser).toBe(false);
    expect(keystoneContext.graphql.schema).toBeDefined();
  });
});
