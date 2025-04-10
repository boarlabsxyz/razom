import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderOptions,
} from '@testing-library/react';
import LoginForm from './LoginForm';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import {
  CHECK_USER_QUERY,
  CURRENT_USER_QUERY,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_MUTATION,
} from 'constants/graphql';

const mocks = {
  login: [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: { email: 'test@example.com', password: 'Password123' },
      },
      result: {
        data: {
          authenticateUserWithPassword: {
            item: {
              id: '1',
              email: 'test@example.com',
              role: 'USER',
              name: 'Test User',
              isVerified: true,
            },
          },
        },
      },
    },
  ],
  logout: [
    {
      request: { query: LOGOUT_MUTATION },
      result: { data: { endSession: true } },
    },
  ],
  loginError: [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: { email: 'wrong@example.com', password: 'Password123' },
      },
      error: new Error('Invalid credentials'),
    },
  ],
  oauth: [
    {
      request: {
        query: CHECK_USER_QUERY,
        variables: { email: 'oauth@example.com' },
      },
      result: { data: { user: null } },
    },
    {
      request: {
        query: REGISTER_MUTATION,
        variables: {
          name: 'OAuth User',
          email: 'oauth@example.com',
          password: 'withoutpassword',
        },
      },
      result: {
        data: { createUser: { id: '456', email: 'oauth@example.com' } },
      },
    },
  ],
};

const AllProviders: React.FC<{
  children: React.ReactNode;
  mocks?: MockedResponse[];
}> = ({ children, mocks = [] }) => (
  <SessionProvider session={null}>
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  </SessionProvider>
);

const customRender = (
  ui: React.ReactElement,
  mocks: MockedResponse[] = [],
  options?: RenderOptions,
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks}>{children}</AllProviders>
    ),
    ...options,
  });

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Auth Forms', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: jest.fn(),
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render login form correctly', () => {
    customRender(<LoginForm />);
    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('should display OAuth login button', () => {
    customRender(<LoginForm />);
    expect(
      screen.getByRole('button', { name: /Увійти через Google/i }),
    ).toBeInTheDocument();
  });

  it('should display validation errors for empty fields', async () => {
    customRender(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('should log in successfully with valid credentials and redirect to homepage', async () => {
    customRender(<LoginForm />, [...mocks.login, ...mocks.logout]);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('should handle login errors correctly', async () => {
    customRender(<LoginForm />, mocks.loginError);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument(),
    );
  });

  it('should handle OAuth authentication and redirect to home', async () => {
    customRender(<LoginForm />, mocks.oauth);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('should show error if network is down during login', async () => {
    const networkErrorMock = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: { email: 'test@example.com', password: 'Password123' },
        },
        error: new Error('Network error'),
      },
    ];

    customRender(<LoginForm />, networkErrorMock);
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText('Network error')).toBeInTheDocument(),
    );
  });

  it('should display submit error message when login fails after registration', async () => {
    const submitErrorMock = 'Login failed after registration';

    const mocksWithError = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: { email: 'test@example.com', password: 'Password123' },
        },
        result: {
          data: {
            authenticateUserWithPassword: {
              message: submitErrorMock,
            },
          },
        },
      },
    ];

    customRender(<LoginForm />, mocksWithError);

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText(submitErrorMock)).toBeInTheDocument(),
    );
  });
});
