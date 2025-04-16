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
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_MUTATION,
} from 'constants/graphql';

const mocks = {
  login: [
    {
      request: {
        query: LOGIN_MUTATION,
        variables: {
          email: 'test@example.com',
          password: process.env.SESSION_SECRET,
        },
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
        variables: {
          email: 'wrong@example.com',
          password: process.env.SESSION_SECRET,
        },
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
          password: process.env.SESSION_SECRET,
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

const fillAndSubmitLoginForm = async (email: string, password: string) => {
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  await waitFor(() => screen.getByRole('button', { name: /sign in/i }));
};

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
    await fillAndSubmitLoginForm(
      'test@example.com',
      process.env.SESSION_SECRET ?? '',
    );
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('should handle login errors correctly', async () => {
    customRender(<LoginForm />, mocks.loginError);
    await fillAndSubmitLoginForm(
      'wrong@example.com',
      process.env.SESSION_SECRET ?? '',
    );
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
          variables: {
            email: 'test@example.com',
            password: process.env.SESSION_SECRET,
          },
        },
        error: new Error('Network error'),
      },
    ];

    customRender(<LoginForm />, networkErrorMock);
    await fillAndSubmitLoginForm(
      'test@example.com',
      process.env.SESSION_SECRET ?? '',
    );
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
          variables: {
            email: 'test@example.com',
            password: process.env.SESSION_SECRET,
          },
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
    await fillAndSubmitLoginForm(
      'test@example.com',
      process.env.SESSION_SECRET ?? '',
    );
    await waitFor(() =>
      expect(screen.getByText(submitErrorMock)).toBeInTheDocument(),
    );
  });

  it('should render EmailVerification component when user is not verified', async () => {
    const testEmail = 'unverified@example.com';

    const mocksWithUnverifiedUser = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: testEmail,
            password: process.env.SESSION_SECRET,
          },
        },
        result: {
          data: {
            authenticateUserWithPassword: {
              item: {
                id: '1',
                email: testEmail,
                name: 'Unverified User',
                role: 'USER',
                isVerified: false,
              },
            },
          },
        },
      },
    ];

    jest.mock('@helpers/handleSendEmail', () => ({
      handleSendEmail: jest.fn(() =>
        Promise.resolve({ success: true, code: '123456' }),
      ),
    }));

    customRender(<LoginForm />, mocksWithUnverifiedUser);
    await fillAndSubmitLoginForm(testEmail, process.env.SESSION_SECRET ?? '');

    await waitFor(() =>
      expect(
        screen.getByText(/verify your email address/i),
      ).toBeInTheDocument(),
    );
  });
});
