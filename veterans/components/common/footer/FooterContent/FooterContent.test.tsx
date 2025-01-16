import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FooterContent from './FooterContent';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('FooterContent Component', () => {
  it('renders all elements correctly', () => {
    render(<FooterContent />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('footerContainer')).toBeInTheDocument();
    expect(screen.getByTestId('footer-devs')).toBeInTheDocument();
  });

  it('displays the correct footer text', () => {
    render(<FooterContent />);
    expect(screen.getByText('Developed by BoarLabz')).toBeInTheDocument();
  });
});
