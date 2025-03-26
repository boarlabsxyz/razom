import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginAuthButton from './LoginAuthButton';
import { signIn, signOut, useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}));

describe('LoginAuthButton', () => {
  it('should render "Login with Google" button when not logged in', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<LoginAuthButton />);

    expect(
      screen.getByRole('button', { name: /увійти через google/i }),
    ).toBeInTheDocument();
  });

  it('should call signIn when the "Login with Google" button is clicked', async () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    render(<LoginAuthButton />);

    const loginButton = screen.getByRole('button', {
      name: /увійти через google/i,
    });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('google');
    });
  });

  it('should render user name and "Sign out" button when logged in', () => {
    const sessionData = { data: { user: { name: 'Test User' } } };
    (useSession as jest.Mock).mockReturnValue(sessionData);

    render(<LoginAuthButton />);

    expect(screen.getByText('Привіт, Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /вийти/i })).toBeInTheDocument();
  });

  it('should call signOut when the "Sign out" button is clicked', async () => {
    const sessionData = { data: { user: { name: 'Test User' } } };
    (useSession as jest.Mock).mockReturnValue(sessionData);

    render(<LoginAuthButton />);

    const signOutButton = screen.getByRole('button', { name: /вийти/i });
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });
});
