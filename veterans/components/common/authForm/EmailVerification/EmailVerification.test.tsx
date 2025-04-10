import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import EmailVerification from './EmailVerification';

jest.mock('@apollo/client');
jest.mock('next/navigation');
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('EmailVerification', () => {
  const mockRouterPush = jest.fn();
  const mockUseQuery = useQuery as jest.Mock;
  const mockUseMutation = useMutation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    mockUseQuery.mockReturnValue({
      data: { user: { id: '1' } },
    });

    mockUseMutation.mockReturnValue([jest.fn()]);
  });

  it('renders the component correctly', () => {
    render(
      <EmailVerification verificationCode="1234" email="test@example.com" />,
    );

    expect(
      screen.getByPlaceholderText('Email verification'),
    ).toBeInTheDocument();
    expect(screen.getByText('Verify your email address')).toBeInTheDocument();
  });

  it('handles invalid verification code', async () => {
    render(
      <EmailVerification verificationCode="1234" email="test@example.com" />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email verification'), {
      target: { value: 'wrong-code' },
    });

    fireEvent.click(screen.getByText('Ok'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Invalid verification code'),
    );
  });

  it('successfully verifies the email and redirects', async () => {
    const mockUpdateUserVerification = jest.fn().mockResolvedValue({
      data: {
        updateUser: { isVerified: true },
      },
    });
    mockUseMutation.mockReturnValue([mockUpdateUserVerification]);

    render(
      <EmailVerification verificationCode="1234" email="test@example.com" />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email verification'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Ok'));

    await waitFor(() =>
      expect(mockUpdateUserVerification).toHaveBeenCalledWith({
        variables: { id: '1', isVerified: true },
      }),
    );

    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('handles failed verification', async () => {
    const mockUpdateUserVerification = jest.fn().mockResolvedValue({
      data: {
        updateUser: { isVerified: false },
      },
    });
    mockUseMutation.mockReturnValue([mockUpdateUserVerification]);

    render(
      <EmailVerification verificationCode="1234" email="test@example.com" />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email verification'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Ok'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Verification failed'),
    );
  });

  it('handles mutation error', async () => {
    const mockUpdateUserVerification = jest
      .fn()
      .mockRejectedValue(new Error('Network error'));
    mockUseMutation.mockReturnValue([mockUpdateUserVerification]);

    render(
      <EmailVerification verificationCode="1234" email="test@example.com" />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email verification'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Ok'));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Network error'),
    );
  });
});
