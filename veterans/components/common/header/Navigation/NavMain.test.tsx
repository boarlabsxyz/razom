import React from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavMain from './NavMain';
import { NavigationMenuProps } from '@comComps/NavMenu/NavMenu';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('@comComps/NavMenu', () => {
  return jest.fn(({ pages, pathname, st }: NavigationMenuProps) => (
    <nav className={st['nav-container']} aria-label="Main navigation">
      <ul className={st['nav-list']}>
        {Object.entries(pages).map(([key, value]) => {
          const isActive = pathname === `/${key}`;
          return (
            <li key={key} data-cy={`${key}-navMenu-link`}>
              <a
                href={`/${key}`}
                className={`${st.link} ${isActive ? st.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {value}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  ));
});

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
    login: 'Увійти',
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
      const element = document.querySelector(`[data-cy="${key}-navMenu-link"]`);
      expect(element).toBeInTheDocument();
      expect(element).toHaveAttribute('data-cy', `${key}-navMenu-link`);
    });
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<NavMain />);

    const firstLink = screen.getByRole('link', { name: 'Мета' });
    await user.tab();
    expect(firstLink).toHaveFocus();
  });

  it('handles invalid paths gracefully', () => {
    (usePathname as jest.Mock).mockReturnValue('/invalid-path');
    render(<NavMain />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link).not.toHaveClass('active');
    });
  });

  it('meets accessibility requirements', () => {
    const activePage = '/news';
    (usePathname as jest.Mock).mockReturnValue(activePage);

    render(<NavMain />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === activePage;
      if (isActive) {
        expect(link).toHaveAttribute('aria-current', 'page');
      } else {
        expect(link).not.toHaveAttribute('aria-current');
      }
    });
  });
});
