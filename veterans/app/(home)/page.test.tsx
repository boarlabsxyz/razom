import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from './page';

jest.mock('@comComps/container', () =>
  jest.fn(({ children }) => <div data-testid="container">{children}</div>),
);
jest.mock('@comps/homePage/hero/Hero', () =>
  jest.fn(() => <div data-testid="hero-section" />),
);
jest.mock('@comps/homePage/mapSection', () =>
  jest.fn(() => <div data-testid="map-section" />),
);

describe('HomePage', () => {
  it('renders Container, Hero, and InitiativesSection components', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('map-section')).toBeInTheDocument();
  });
});
