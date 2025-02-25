import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FooterContent from './FooterContent';
import { useUser } from 'hooks/useUser';

jest.mock('hooks/useUser');

describe('FooterContent Component', () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
    });
  });
  it('renders all elements correctly', () => {
    const mockChildText = 'This is a child element';

    render(
      <FooterContent>
        <div>{mockChildText}</div>
      </FooterContent>,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('footerContainer')).toBeInTheDocument();
    expect(screen.getByTestId('footer-devs')).toBeInTheDocument();
  });

  it('displays the correct footer text', () => {
    const mockChildText = 'This is a child element';

    render(
      <FooterContent>
        <div>{mockChildText}</div>
      </FooterContent>,
    );
    expect(screen.getByText('Developed by BoarLabs')).toBeInTheDocument();
  });
});
