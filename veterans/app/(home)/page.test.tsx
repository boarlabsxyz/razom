import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

jest.mock('@comComps/container', () =>
  jest.fn(({ children }) => <div data-testid="container">{children}</div>),
);
jest.mock('@comps/homePage/hero/Hero', () =>
  jest.fn(() => <div data-testid="hero" />),
);
jest.mock('@comps/homePage/initiativesSection', () =>
  jest.fn(() => <div data-testid="initiatives-section" />),
);

describe('HomePage', () => {
  it('renders Container, Hero, and InitiativesSection components', () => {
    render(<HomePage />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('initiatives-section')).toBeInTheDocument();
  });
});
