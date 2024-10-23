import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from './layout';

jest.mock('./layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('RootLayout', () => {
  it('renders children correctly', () => {
    render(
      <RootLayout>
        <div>Hello, Veterans!</div>
      </RootLayout>,
    );

    expect(screen.getByText('Hello, Veterans!')).toBeInTheDocument();
  });
});
