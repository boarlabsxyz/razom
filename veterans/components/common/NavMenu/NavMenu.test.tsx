import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavMenu from './NavMenu';
import { useUser } from 'hooks/useUser';

jest.mock('hooks/useUser');

describe('NavMenu', () => {
  const mockPages = {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
  };

  const mockStyles = {
    navContainer: 'navContainer',
    navList: 'navList',
    link: 'link',
    active: 'active',
  };
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
    });
  });

  it('renders all navigation links correctly', () => {
    render(<NavMenu pages={mockPages} pathname={null} st={mockStyles} />);

    Object.entries(mockPages).forEach(([key, value]) => {
      const link = screen.getByText(value);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', `/${key}`);
    });
  });

  it('applies the active class to the active link', () => {
    const activePath = '/about';
    render(<NavMenu pages={mockPages} pathname={activePath} st={mockStyles} />);

    const activeLink = screen.getByText(mockPages['about']);
    expect(activeLink).toHaveClass(mockStyles.active);
    expect(activeLink).toHaveAttribute('aria-current', 'page');

    const inactiveLink = screen.getByText(mockPages['home']);
    expect(inactiveLink).not.toHaveClass(mockStyles.active);
    expect(inactiveLink).not.toHaveAttribute('aria-current');
  });

  it('does not set any link as active if pathname is null', () => {
    render(<NavMenu pages={mockPages} pathname={null} st={mockStyles} />);

    Object.entries(mockPages).forEach(([, value]) => {
      const link = screen.getByText(value);
      expect(link).not.toHaveClass(mockStyles.active);
      expect(link).not.toHaveAttribute('aria-current');
    });
  });
});
