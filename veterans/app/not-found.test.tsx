import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound, { dynamic } from './not-found';

describe('NotFound Component', () => {
  it('renders the 404 page with correct content', () => {
    render(<NotFound />);
    const heading = screen.getByRole('heading', {
      name: /404 - Page Not Found/i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-4');

    const errorMessage = screen.getByText(
      /The page you are looking for does not exist./i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-lg', 'mb-8');
    const homeLink = screen.getByRole('link', { name: /Return Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    expect(homeLink).toHaveClass(
      'px-6',
      'py-3',
      'bg-blue-600',
      'text-white',
      'rounded-lg',
      'hover:bg-blue-700',
      'transition-colors',
    );

    const container = screen.getByRole('heading').parentElement;
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'min-h-screen',
    );
  });

  it('has the correct dynamic export', () => {
    expect(dynamic).toBe('force-dynamic');
  });
});
