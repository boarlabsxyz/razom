import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

import { MockedProvider } from '@apollo/client/testing';
import { REGISTER_MUTATION } from 'constants/graphql';

import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
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
    result: () => {
      return {
        errors: [{ message: 'Email is already taken' }],
      };
    },
  },
];

describe('Auth Forms', () => {
  describe('RegisterForm', () => {
    it(`should render RegisterForm correctly`, () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      expect(
        screen.getByRole('heading', { name: /sign up/i }),
      ).toBeInTheDocument();
    });
    it('should toggle password visibility', () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      const toggleButton = screen.getByRole('button', {
        name: /show password/i,
      });
      const passwordInput = screen.getByPlaceholderText('New Password');
      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveTextContent('Hide Password');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show Password');
    });
    it('should show validation errors when submitting empty fields', async () => {
      render(
        // <MockedProvider mocks={emptyMocks} addTypename={false}>
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      const toggleButton = screen.getByRole('button', { name: /get started/i });
      fireEvent.click(toggleButton);
      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password must be at least 8 characters'),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Confirm password is required'),
      ).toBeInTheDocument();
    });
    it('should show error if passwords do not match', async () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      fireEvent.change(screen.getByPlaceholderText('New Password'), {
        target: { value: 'StrongPass123' },
      });
      fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
        target: { value: 'Mismatch123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      expect(
        await screen.findByText('Passwords must match'),
      ).toBeInTheDocument();
    });
    it('should show toggle button for both password fields', () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      expect(
        screen.getByRole('button', { name: /show password/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /show password/i }),
      ).toBeInTheDocument();
    });
    it('should show error for invalid email format in RegisterForm', async () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'invalidemail' },
      });
      const form = screen.getByRole('form');
      fireEvent.submit(form);
      const errorMessage = await screen.findByText('Invalid email format');
      expect(errorMessage).toBeInTheDocument();
    });
    it('should clear error messages when correcting fields', async () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      await screen.findByText('Email is required');
      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john.doe@example.com' },
      });
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
    it('should show error for password without uppercase letter', async () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      fireEvent.change(screen.getByPlaceholderText('New Password'), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      expect(
        await screen.findByText(
          'Password must contain at least one uppercase letter',
        ),
      ).toBeInTheDocument();
    });
    it('should show error for password without number', async () => {
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
      fireEvent.change(screen.getByPlaceholderText('New Password'), {
        target: { value: 'Password' },
      });
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      expect(
        await screen.findByText('Password must contain at least one number'),
      ).toBeInTheDocument();
    });
    it('should register successfully with valid input', async () => {
      const mockPush = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({
        push: mockPush,
        back: jest.fn(),
      });
      render(
        <MockedProvider mocks={filledMocks} addTypename={false}>
          <RegisterForm />
        </MockedProvider>,
      );
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
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));
      await waitFor(() => {
        expect(
          screen.queryByText('An error occurred during registration'),
        ).not.toBeInTheDocument();
      });
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
    it('should render LoginForm correctly', () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      expect(
        screen.getByRole('heading', { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign in/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/register here/i)).toBeInTheDocument();
    });

    it('should show validation errors when submitting empty fields', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password is required'),
      ).toBeInTheDocument();
    });

    it('should show validation error for invalid email', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'invalidemail' },
      });

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      const errorMessage = await screen.findByTestId('email-error');

      expect(errorMessage).toBeInTheDocument();
    });

    it('should clear error messages when correcting fields in LoginForm', async () => {
      render(<LoginForm onSubmit={mockOnSubmit} />);

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
      await screen.findByText('Email is required');

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'john.doe@example.com' },
      });

      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
    it('should call onSubmit with form data when submission is successful', async () => {
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

    it('should display error message when provided', () => {
      const errorMessage = 'Invalid credentials';
      render(<LoginForm onSubmit={mockOnSubmit} error={errorMessage} />);

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
