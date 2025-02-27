import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

import { MockedProvider } from '@apollo/client/testing';
import { REGISTER_MUTATION } from 'constants/graphql';

import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const filledMocks = [
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
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'USER',
        },
      },
    },
  },
];

const errorMocks = [
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

const renderWithMockedProvider = (
  ui: React.ReactElement,
  mocks = filledMocks,
) => {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {ui}
    </MockedProvider>,
  );
};

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
      renderWithMockedProvider(<RegisterForm />);
      expect(
        screen.getByRole('heading', { name: /sign up/i }),
      ).toBeInTheDocument();
    });

    it('should toggle password visibility', () => {
      renderWithMockedProvider(<RegisterForm />);
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
      renderWithMockedProvider(<RegisterForm />);
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Confirm password is required'),
      ).toBeInTheDocument();
    });

    it('should register successfully with valid input', async () => {
      renderWithMockedProvider(<RegisterForm />);
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

      render(
        <MockedProvider mocks={errorMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
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
      render(<LoginForm onSubmit={mockOnSubmit} />);
      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
    });

    it('should show validation errors for empty fields', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password is required'),
      ).toBeInTheDocument();
    });

    it('should clear error messages when correcting fields', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john.doe@example.com' },
      });

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });

    it('should call onSubmit with form data', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });
});
