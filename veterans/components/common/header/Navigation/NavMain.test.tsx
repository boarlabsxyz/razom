import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavMain from './NavMain';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('./NavMain.module.css', () => ({
  navContainer: 'navContainer',
  navList: 'navList',
  link: 'link',
  active: 'active',
}));

describe('NavMain Component', () => {
  const mockPages = {
    goal: 'Мета',
    partners: 'Партнери',
    news: 'Новини',
    initiatives: 'Ініціативи',
    events: 'Події',
  };

  it('renders all navigation links correctly', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<NavMain />);

    Object.entries(mockPages).forEach(([key, value]) => {
      const link = screen.getByRole('link', { name: value });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/${key}`);
    });
  });

  it('applies the active class to the active link', () => {
    const activePage = '/news';
    (usePathname as jest.Mock).mockReturnValue(activePage);

    render(<NavMain />);

    const activeLink = screen.getByRole('link', { name: 'Новини' });
    expect(activeLink).toHaveClass('link active');

    Object.entries(mockPages).forEach(([key, value]) => {
      const link = screen.getByRole('link', { name: value });
      if (`/${key}` !== activePage) {
        expect(link).not.toHaveClass('active');
      }
    });
  });

  it('renders the correct data-cy attributes for links', () => {
    (usePathname as jest.Mock).mockReturnValue('/');

    render(<NavMain />);

    Object.keys(mockPages).forEach((key) => {
      const element = document.querySelector(`[data-cy="${key}-header-link"]`);
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-cy', `${key}-header-link`);
    });
  });
});
