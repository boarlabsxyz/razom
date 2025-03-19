import React from 'react';

import { LinkProps } from 'next/link';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import Banner from './Banner';
import customImage from '@comComps/customImage';

jest.mock('@comComps/customImage', () =>
  jest.fn(() => <div data-testid="custom-image" />),
);

jest.mock('next/link', () => {
  return ({ children, href, ...props }: React.PropsWithChildren<LinkProps>) => {
    const hrefString = typeof href === 'string' ? href : href.toString();
    return (
      <a href={hrefString} {...props} data-testid="next-link">
        {children}
      </a>
    );
  };
});

jest.mock('@comComps/header/Header.module.css', () => ({
  'banner-container': 'banner-container',
  'banner-link': 'banner-link',
}));

describe('Banner Component', () => {
  const mockProps = {
    name: 'logotype',
    height: 34,
  } as const;

  it('renders the component correctly', () => {
    render(<Banner {...mockProps} />);

    const bannerContainer = screen.getByTestId('next-link');
    expect(bannerContainer).toBeInTheDocument();

    const customImage = screen.getByTestId('custom-image');
    expect(customImage).toBeInTheDocument();
  });

  it('passes correct props to CustomImage', () => {
    render(<Banner {...mockProps} />);

    expect(customImage).toHaveBeenCalledWith(
      expect.objectContaining({
        src: '/img/logo/logotype.svg',
        alt: 'logotype',
        width: 146,
        height: 34,
        priority: true,
      }),
      {},
    );
  });

  it('renders a functional Link component', () => {
    render(<Banner {...mockProps} />);

    const link = screen.getByTestId('next-link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('conditionally adds the prefetch prop to Link component when false', () => {
    render(<Banner {...mockProps} />);

    const link = screen.getByTestId('next-link');
    expect(link).not.toHaveAttribute('prefetch');
  });

  it('applies the correct class names from the CSS module', () => {
    render(<Banner {...mockProps} />);

    const bannerContainer = screen.getByTestId('next-link');
    expect(bannerContainer).toHaveClass('banner-link');
  });
});
