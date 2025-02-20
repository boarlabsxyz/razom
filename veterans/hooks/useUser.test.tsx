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
});
