import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import HomePage from './page';

describe('HomePage component', () => {
  it('renders the main content', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Coming soon...');

    const paragraph = screen.getByText('The site is under construction');
    expect(paragraph).toBeInTheDocument();
  });
});
