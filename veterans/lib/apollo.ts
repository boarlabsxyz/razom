import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_API || 'http://localhost:3000/api/graphql',
  credentials: 'include',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
