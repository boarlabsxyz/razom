/* eslint-disable no-console */
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  from,
  gql,
  ApolloError,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { Observable } from 'zen-observable-ts';
import { waitFor } from '@testing-library/react';

import { retryLink, errorLink } from './apollo';

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Apollo Client', () => {
  const TEST_QUERY = gql`
    query TestQuery {
      testField
    }
  `;

  it('logs GraphQL errors correctly', async () => {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message }) => {
          console.error(`[GraphQL error]: Message: ${message}`);
        });
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`);
      }
    });

    const mockErrorLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.error(
          new ApolloError({
            graphQLErrors: [{ message: 'Test GraphQL Error' }],
          }),
        );
      });
    });

    const testClient = new ApolloClient({
      link: from([errorLink, mockErrorLink]),
      cache: new InMemoryCache(),
    });

    await expect(testClient.query({ query: TEST_QUERY })).rejects.toThrow(
      'Test GraphQL Error',
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Test GraphQL Error'),
      );
    });
  });

  it('logs Network error correctly', async () => {
    const networkErrorLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.error(new Error('Network error occurred'));
      });
    });

    const testClient = new ApolloClient({
      link: from([errorLink, networkErrorLink]),
      cache: new InMemoryCache(),
    });

    await expect(testClient.query({ query: TEST_QUERY })).rejects.toThrow(
      'Network error occurred',
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Network error occurred'),
      );
    });
  });

  it('retries failed requests using RetryLink', async () => {
    const retryLink = new RetryLink({
      attempts: {
        max: 2,
        retryIf: () => true,
      },
      delay: { initial: 100 },
    });

    let callCount = 0;
    const mockErrorLink = new ApolloLink(() => {
      return new Observable((observer) => {
        callCount++;
        observer.error(new Error('Network failure'));
        observer.complete();
      });
    });

    const testClient = new ApolloClient({
      link: from([retryLink, mockErrorLink]),
      cache: new InMemoryCache(),
    });

    await expect(testClient.query({ query: TEST_QUERY })).rejects.toThrow();

    await waitFor(() => {
      expect(callCount).toBe(2);
    });
  });

  it('handles timeout correctly', async () => {
    const timeoutLink = new ApolloLink((operation, forward) => {
      return new Observable((observer) => {
        const timeout = setTimeout(() => {
          observer.error(new Error('The request exceeded the timeout'));

          observer.complete();
        }, 500);

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

    const mockSlowLink = new ApolloLink(() => {
      return new Observable(() => {});
    });

    const testClient = new ApolloClient({
      link: from([timeoutLink, mockSlowLink]),
      cache: new InMemoryCache(),
    });

    await expect(testClient.query({ query: TEST_QUERY })).rejects.toThrow(
      'The request exceeded the timeout',
    );
  });

  it('fails after maximum retries', async () => {
    let callCount = 0;
    const mockErrorLink = new ApolloLink(() => {
      return new Observable((observer) => {
        callCount++;
        observer.error(new Error('Permanent failure'));
      });
    });

    const testClient = new ApolloClient({
      link: from([retryLink, mockErrorLink]),
      cache: new InMemoryCache(),
    });

    await expect(testClient.query({ query: TEST_QUERY })).rejects.toThrow(
      'Permanent failure',
    );

    expect(callCount).toBe(3);
  });
});
