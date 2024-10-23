import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the "Coming soon..." message', () => {
    const { getByText } = render(<HomePage />);

    expect(getByText('Coming soon...')).toBeInTheDocument();

    expect(getByText('The site is under construction')).toBeInTheDocument();
  });
});
