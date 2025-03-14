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

const loginMock: MockedResponse[] = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: {
        email: 'test@example.com',
        password: 'Password123',
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
          },
        },
      },
    },
  },
];

const logoutMock: MockedResponse[] = [
  {
    request: {
      query: LOGOUT_MUTATION,
    },
    result: { data: { endSession: true } },
  },
];

const loginErrorMock: MockedResponse[] = [
  {
    request: {
      query: LOGIN_MUTATION,
      variables: { email: 'wrong@example.com', password: 'WrongPassword' },
    },
    error: new Error('Invalid credentials'),
  },
];

const oauthMock: MockedResponse[] = [
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
    result: { data: { createUser: { id: '456', email: 'oauth@example.com' } } },
  },
];

const AllProviders: React.FC<{
  children: React.ReactNode;
  mocks?: MockedResponse[];
}> = ({ children, mocks = [] }) => {
  return (
    <SessionProvider session={null}>
      <MockedProvider mocks={mocks} addTypename={false}>
        {children}
      </MockedProvider>
    </SessionProvider>
  );
};

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

  describe('RegisterForm', () => {
    it('should render correctly', () => {
      customRender(<RegisterForm />);
      expect(
        screen.getByRole('heading', { name: /sign up/i }),
      ).toBeInTheDocument();
    });
    it('should toggle password visibility', () => {
      customRender(<RegisterForm />);
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      const passwordInput = screen.getByPlaceholderText('New Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
    it('should show validation errors for empty fields', async () => {
      customRender(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Confirm password is required'),
      ).toBeInTheDocument();
    });
    it('should register successfully with valid input', async () => {
      customRender(<RegisterForm />, mocks);
      fillRegisterForm();
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
    it('should show an error if the email is already taken', async () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      customRender(<RegisterForm />, errorMocks);
      fillRegisterForm();
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      await waitFor(() => {
        expect(screen.getByText('Email is already taken')).toBeInTheDocument();
      });

      consoleErrorMock.mockRestore();
    });
  });

  describe('LoginForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
      mockOnSubmit.mockClear();
    });

    it('should render correctly', () => {
      customRender(<LoginForm />);
      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      customRender(<LoginForm />);

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password is required'),
      ).toBeInTheDocument();
    });

    it('should log in successfully with correct credentials', async () => {
      customRender(<LoginForm />, [...loginMock, ...logoutMock]);
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'Password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should clear error messages when correcting fields', async () => {
      customRender(<LoginForm />);
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john.doe@example.com' },
      });

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('should show an error for incorrect credentials', async () => {
      customRender(<LoginForm />, loginErrorMock);
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'wrong@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'WrongPassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });

    it('should handle OAuth authentication', async () => {
      customRender(<LoginForm />, oauthMock);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });
  });
});
