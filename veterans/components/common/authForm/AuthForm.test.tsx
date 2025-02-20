import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';

describe('Auth Forms', () => {
  describe('RegisterForm', () => {
    it('should render RegisterForm correctly', () => {
      render(<RegisterForm />);

      expect(
        screen.getByRole('heading', { name: /sign up/i }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText('Confirm Password'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /get started/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('should toggle password visibility', () => {
      render(<RegisterForm />);

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
      render(<RegisterForm />);

      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(await screen.findByText('Email is required')).toBeInTheDocument();
      expect(
        await screen.findByText('Password is required'),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Confirm password is required'),
      ).toBeInTheDocument();
    });

    it('should show error if passwords do not match', async () => {
      render(<RegisterForm />);

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
      render(<RegisterForm />);

      expect(
        screen.getByRole('button', { name: /show password/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /show password/i }),
      ).toBeInTheDocument();
    });

    it('should show error for invalid email format in RegisterForm', async () => {
      render(<RegisterForm />);

      fireEvent.change(screen.getByPlaceholderText('Email'), {
        target: { value: 'invalidemail' },
      });

      const form = screen.getByRole('form');
      fireEvent.submit(form);

      const errorMessage = await screen.findByTestId('email-error');

      expect(errorMessage).toBeInTheDocument();
    });

    it('should clear error messages when correcting fields', async () => {
      render(<RegisterForm />);

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
      render(<RegisterForm />);

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
      render(<RegisterForm />);

      fireEvent.change(screen.getByPlaceholderText('New Password'), {
        target: { value: 'Password' },
      });
      fireEvent.click(screen.getByRole('button', { name: /get started/i }));

      expect(
        await screen.findByText('Password must contain at least one number'),
      ).toBeInTheDocument();
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
  });
});
