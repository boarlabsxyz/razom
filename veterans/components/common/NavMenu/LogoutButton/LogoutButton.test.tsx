import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client';
import LogoutButton from './LogoutButton';
import { signOut } from 'next-auth/react';

jest.mock('./LogoutButton.module.css', () => ({
  wrapper: 'mocked-wrapper-class',
}));

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

describe('LogoutButton', () => {
  let mockApolloClient: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    mockApolloClient = new ApolloClient({
      cache: new InMemoryCache(),
    });

    jest.spyOn(mockApolloClient, 'mutate').mockResolvedValue({
      data: {
        logout: true,
      },
    });
    jest.spyOn(mockApolloClient, 'clearStore');

    (signOut as jest.Mock).mockClear();

    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true,
    });
  });

  it('renders the button with correct text', () => {
    const { getByText } = render(
      <MockedProvider mocks={[]}>
        <LogoutButton />
      </MockedProvider>,
    );

    expect(getByText('Вийти')).toBeInTheDocument();
  });

  it('logs an error if logout mutation fails', async () => {
    const mockLogoutErrorResponse = {
      request: {
        query: LOGOUT_MUTATION,
      },
      error: new Error('Logout failed'),
    };

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { getByText } = render(
      <MockedProvider mocks={[mockLogoutErrorResponse]} addTypename={false}>
        <LogoutButton />
      </MockedProvider>,
    );

    fireEvent.click(getByText('Вийти'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Помилка при виході:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
