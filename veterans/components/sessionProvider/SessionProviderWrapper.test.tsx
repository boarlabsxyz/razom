import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SessionProviderWrapper from './SessionProviderWrapper';
import { SessionProvider } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  SessionProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('SessionProviderWrapper', () => {
  it('should render children inside SessionProvider', () => {
    const children = <div>Test Child</div>;

    render(<SessionProviderWrapper>{children}</SessionProviderWrapper>);

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('should use SessionProvider component from next-auth/react', () => {
    const children = <div>Test Child</div>;

    render(<SessionProviderWrapper>{children}</SessionProviderWrapper>);

    expect(SessionProvider).toHaveBeenCalledWith(
      expect.objectContaining({ children: expect.anything() }),
      expect.anything(),
    );
  });
});
