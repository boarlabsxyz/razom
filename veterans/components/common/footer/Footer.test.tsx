import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Footer from './Footer';

afterEach(() => {
  cleanup();
});

jest.mock('../container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

test('should render Footer component correctly', () => {
  render(
    <Footer>
      <div data-testid="child">Child</div>
    </Footer>,
  );
  const childElement = screen.getByTestId('child');
  expect(childElement).toBeInTheDocument();
});
