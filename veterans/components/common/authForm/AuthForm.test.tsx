import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  });

  describe('LoginForm', () => {
    it('should render LoginForm correctly', () => {
      render(<LoginForm />);

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
  });
});
