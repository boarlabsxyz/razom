import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import MapSection from './MapSection';

jest.mock('@comps/homePage/mapSection/map', () =>
  jest.fn(() => <div data-testid="UkraineMap" />),
);

jest.mock('@comps/homePage/mapSection/regionsFilter', () =>
  jest.fn(() => <div data-testid="regions-filter" />),
);

jest.mock('@comps/homePage/mapSection/initiativesFilter', () =>
  jest.fn(() => <div data-testid="initiateves-filter" />),
);

describe('HomePage', () => {
  it('renders Container, Hero, and InitiativesSection components', () => {
    render(<MapSection />);

    expect(screen.getByTestId('UkraineMap')).toBeInTheDocument();
    expect(screen.getByTestId('regions-filter')).toBeInTheDocument();
    expect(screen.getByTestId('initiateves-filter')).toBeInTheDocument();
  });
});
