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
import { REGISTER_MUTATION } from 'constants/graphql';

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

  it('should render registration form correctly', () => {
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

  it('should display validation errors for empty fields', async () => {
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
