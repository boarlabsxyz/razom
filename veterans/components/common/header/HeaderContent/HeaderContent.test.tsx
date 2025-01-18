import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import HeaderContent from './HeaderContent';

jest.mock('@comComps/header/Navigation/NavMain', () => () => (
  <div data-testid="nav-main" />
));

describe('HeaderContent', () => {
  it('renders children correctly', () => {
    const mockChildText = 'This is a child element';

    render(
      <HeaderContent>
        <div>{mockChildText}</div>
      </HeaderContent>,
    );

    expect(screen.getByText(mockChildText)).toBeInTheDocument();
  });

  it('renders the NavMain component', () => {
    render(
      <HeaderContent>
        <div>Test Child</div>
      </HeaderContent>,
    );

    expect(screen.getByTestId('nav-main')).toBeInTheDocument();
  });
});
