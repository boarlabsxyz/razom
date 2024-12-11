import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import Header from './Header';

jest.mock('../container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Header component', () => {
  it('renders the children correctly', () => {
    render(
      <Header>
        <div data-testid="child">Test Child</div>
      </Header>,
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
  });

  it('adds bottomBorder class when scrolled past threshold', () => {
    render(
      <Header>
        <div>Test Content</div>
      </Header>,
    );

    const headerElement = screen.getByRole('banner');

    act(() => {
      document.body.scrollTop = 3;
      document.documentElement.scrollTop = 3;
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(headerElement.classList.contains('bottomBorder')).toBe(true);

    act(() => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.dispatchEvent(new Event('scroll'));
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(headerElement.classList.contains('bottomBorder')).toBe(false);
  });
});
