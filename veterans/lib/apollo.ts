import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { Observable } from 'zen-observable-ts';

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      // eslint-disable-next-line no-console
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError}`);
  }
});

const timeoutLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const timeout = setTimeout(() => {
      observer.error(new Error('Запит перевищив час очікування'));
    }, 10000);

    const subscription = forward(operation).subscribe({
      next: (data) => {
        clearTimeout(timeout);
        observer.next(data);
      },
      error: (err) => {
        clearTimeout(timeout);
        observer.error(err);
      },
      complete: () => {
        clearTimeout(timeout);
        observer.complete();
      },
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  });
});

export const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      // eslint-disable-next-line no-console
      console.log(`Retrying operation: ${operation.operationName}`);
      return !!error;
    },
  },
});

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_API,
  credentials: 'include',
});

export const client = new ApolloClient({
  link: from([errorLink, timeoutLink, retryLink, httpLink]),
  cache: new InMemoryCache(),
});
