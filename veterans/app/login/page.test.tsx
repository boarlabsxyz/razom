import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { useRouter } from 'next/navigation';
import LoginPage from './page';
import { LOGIN_MUTATION } from 'constants/graphql';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockBack = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ push: mockPush, back: mockBack });

const mockLoginSuccess = {
  request: {
    query: LOGIN_MUTATION,
    variables: { email: 'test@example.com', password: 'password123' },
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
};

const mockLoginError = {
  request: {
    query: LOGIN_MUTATION,
    variables: { email: 'wrong@example.com', password: 'wrongpassword' },
  },
  result: {
    data: {
      authenticateUserWithPassword: {
        message: 'Invalid credentials',
      },
    },
  },
};

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <MockedProvider>
        <LoginPage />
      </MockedProvider>,
    );

    expect(
      screen.getByRole('heading', { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it('logs in successfully and redirects', async () => {
    render(
      <MockedProvider mocks={[mockLoginSuccess]} addTypename={false}>
        <LoginPage />
      </MockedProvider>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'));
  });

  it('shows an error message on failed login', async () => {
    render(
      <MockedProvider mocks={[mockLoginError]} addTypename={false}>
        <LoginPage />
      </MockedProvider>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument(),
    );
  });
});
