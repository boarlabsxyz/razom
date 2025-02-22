import { renderHook, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { useUser } from './useUser';
import { CURRENT_USER_QUERY } from 'constants/graphql';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'USER',
  __typename: 'User',
};

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        authenticatedItem: mockUser,
      },
    },
  },
];

describe('useUser hook', () => {
  it('returns user data when query succeeds', async () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('shows loading state initially', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      ),
    });

    expect(result.current.loading).toBe(true);
  });

  it('handles error state', async () => {
    const errorMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        error: new Error('Failed to fetch'),
      },
    ];

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={errorMocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeDefined();
    expect(result.current.user).toBeNull();
  });

  it('handles null response', async () => {
    const nullMocks = [
      {
        request: { query: CURRENT_USER_QUERY },
        result: {
          data: {
            authenticatedItem: null,
          },
        },
      },
    ];

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={nullMocks}>{children}</MockedProvider>
      ),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeUndefined();
  });
});
