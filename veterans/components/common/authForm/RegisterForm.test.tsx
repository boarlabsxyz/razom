import '@testing-library/jest-dom';
import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  RenderOptions,
} from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { LOGIN_MUTATION, REGISTER_MUTATION } from 'constants/graphql';
import { generateSecureCode } from '@helpers/generateSecureCode';
import LoginForm from './LoginForm';

const mocks: MockedResponse[] = [
  {
    request: {
      query: REGISTER_MUTATION,
      variables: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      },
    },
    result: {
      data: {
        createUser: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
    },
  },
];

const errorMocks: MockedResponse[] = [
  {
    request: {
      query: REGISTER_MUTATION,
      variables: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      },
    },
    error: new Error('Email is already taken'),
  },
];

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

const fillRegisterForm = () => {
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'Test User' },
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('New Password'), {
    target: { value: 'Password123' },
  });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
    target: { value: 'Password123' },
  });
};

const fillLoginForm = (email: string, password: string) => {
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: password },
  });
};

const submitForm = () => {
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
};

describe('Auth Forms', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render registration form correctly', () => {
    customRender(<RegisterForm />);
    expect(
      screen.getByRole('heading', { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    customRender(<RegisterForm />);
    const toggleButton = screen.getByRole('button', { name: /show password/i });
    const passwordInput = screen.getByPlaceholderText('New Password');

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should display validation errors for empty fields', async () => {
    customRender(<RegisterForm />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Confirm password is required'),
    ).toBeInTheDocument();
  });

  it('should show an error if the email is already taken', async () => {
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    customRender(<RegisterForm />, errorMocks);
    fillRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is already taken')).toBeInTheDocument();
    });

    consoleErrorMock.mockRestore();
  });

  it('should generate a secure code within the expected range', () => {
    const secureCode = generateSecureCode();
    expect(Number(secureCode)).toBeGreaterThanOrEqual(1000);
    expect(Number(secureCode)).toBeLessThanOrEqual(9999);
  });

  it('should show an error if the registration fails', async () => {
    customRender(<RegisterForm />, errorMocks);

    fillRegisterForm();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is already taken')).toBeInTheDocument();
    });
  });

  it('should submit form and send verification email on successful registration', async () => {
    customRender(<RegisterForm />, mocks);

    fillRegisterForm();

    const mockSendEmail = jest.spyOn(window, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Verification code'),
      ).toBeInTheDocument();
    });

    expect(mockSendEmail).toHaveBeenCalledWith(
      '/api/sendEmail',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('You need to verify your email address'),
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      }),
    );

    mockSendEmail.mockRestore();
  });

  it('should update confirmedCode state when typing in the verification input', async () => {
    customRender(<RegisterForm />, mocks);

    fillRegisterForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Verification code'),
      ).toBeInTheDocument();
    });

    const verificationInput = screen.getByPlaceholderText('Verification code');

    fireEvent.change(verificationInput, { target: { value: '1234' } });
    expect(verificationInput).toHaveValue('1234');
  });

  it('should show an error if network is down during login', async () => {
    const networkErrorMock = [
      {
        request: {
          query: LOGIN_MUTATION,
          variables: {
            email: 'test@example.com',
            password: process.env.SESSION_SECRET ?? '',
          },
        },
        error: new Error('Network error'),
      },
    ];

    customRender(<LoginForm />, networkErrorMock);
    fillLoginForm('test@example.com', process.env.SESSION_SECRET ?? '');
    submitForm();

    await waitFor(() =>
      expect(screen.getByText('Network error')).toBeInTheDocument(),
    );
  });
});
