import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Initiatives from './Initiatives';

jest.mock('@comps/homePage/initiatives/map/UkraineMap', () =>
  jest.fn(() => <div data-testid="UkraineMap" />),
);

jest.mock('@comps/homePage/initiatives/regionsFilter/regionsList', () =>
  jest.fn(() => <div data-testid="regionList" />),
);

jest.mock('@comps/homePage/initiatives/initiativeList', () =>
  jest.fn(() => <div data-testid="initiateveList" />),
);

describe('HomePage', () => {
  it('renders Container, Hero, and InitiativesSection components', () => {
    render(<Initiatives />);

    expect(screen.getByTestId('UkraineMap')).toBeInTheDocument();
    expect(screen.getByTestId('regionList')).toBeInTheDocument();
    expect(screen.getByTestId('initiateveList')).toBeInTheDocument();
  });
});
