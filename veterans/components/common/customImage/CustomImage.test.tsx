import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CustomImage from './CustomImage';
import getImageQuality from '../../../helpers/getImageQuality';

jest.mock('../../../helpers/getImageQuality', () => jest.fn());

describe('CustomImage Component', () => {
  it('renders correctly with provided props', () => {
    const mockSrc = '/test-image.jpg';
    const mockAlt = 'Test Image';
    const mockQuality = 75;
    (getImageQuality as jest.Mock).mockReturnValue(mockQuality);

    render(
      <CustomImage src={mockSrc} alt={mockAlt} width={300} height={200} />,
    );

    const image = screen.getByAltText(mockAlt) as HTMLImageElement;
    expect(image).toBeInTheDocument();

    const decodedSrc = decodeURIComponent(image.src);
    expect(decodedSrc).toContain(mockSrc);

    expect(getImageQuality).toHaveBeenCalledWith(mockSrc);
  });

  it('passes additional props to the Image component', () => {
    const mockSrc = '/test-image.jpg';
    const mockAlt = 'Test Image';
    const mockClassName = 'custom-class';
    (getImageQuality as jest.Mock).mockReturnValue(75);

    render(
      <CustomImage
        src={mockSrc}
        alt={mockAlt}
        className={mockClassName}
        width={300}
        height={200}
      />,
    );

    const image = screen.getByAltText(mockAlt);
    expect(image).toHaveClass(mockClassName);
  });

  it('calls getImageQuality with the correct src', () => {
    const mockSrc = '/another-image.jpg';
    const mockQuality = 50;
    (getImageQuality as jest.Mock).mockReturnValue(mockQuality);

    render(
      <CustomImage
        src={mockSrc}
        alt="Another Test Image"
        width={300}
        height={200}
      />,
    );

    expect(getImageQuality).toHaveBeenCalledWith(mockSrc);
    const image = screen.getByAltText('Another Test Image') as HTMLImageElement;
    expect(image.src).toContain(`q=${mockQuality}`);
  });

  it('handles getImageQuality errors gracefully', () => {
    const mockSrc = '/error-image.jpg';
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (getImageQuality as jest.Mock).mockImplementation(() => {
      throw new Error('Quality calculation failed');
    });

    render(
      <CustomImage
        src={mockSrc}
        alt="Error Test Image"
        width={300}
        height={200}
      />,
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to calculate image quality:',
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
