import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

jest.mock('./hero/Hero', () => {
  return function MockHero() {
    return <div data-testid="mock-hero">Hero Component</div>;
  };
});

jest.mock('./mapSection/MapSection', () => {
  return function MockMapSection() {
    return <div data-testid="mock-map-section">Map Section Component</div>;
  };
});

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders Hero component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-hero')).toBeInTheDocument();
  });

  it('renders MapSection component', () => {
    render(<HomePage />);
    expect(screen.getByTestId('mock-map-section')).toBeInTheDocument();
  });

  it('renders components in correct order', () => {
    render(<HomePage />);
    const main = screen.getByRole('main');
    const children = Array.from(main.children);

    expect(children[0]).toHaveAttribute('data-testid', 'mock-hero');
    expect(children[1]).toHaveAttribute('data-testid', 'mock-map-section');
  });
});
