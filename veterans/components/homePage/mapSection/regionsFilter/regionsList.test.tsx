import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionsList from './regionsList';

jest.mock('data/RegionsArray', () =>
  Array.from({ length: 26 }, (_, i) => ({
    name: `Region ${i + 1}`,
    numOfInitiatives: i * 2,
  })),
);

describe('RegionsList Component', () => {
  let mockSetSelectedRegion: jest.Mock;

  beforeEach(() => {
    mockSetSelectedRegion = jest.fn();
  });

  test('correctly renders and shows default region', () => {
    render(
      <RegionsList
        selectedRegion="Region 5"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    expect(screen.getByTestId('btn-for-region-selection')).toBeInTheDocument();
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 5/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('dropdown opens and highlights the selected region', () => {
    render(
      <RegionsList
        selectedRegion="Region 10"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    const selectedRegionElement = screen.getByRole('menuitemradio', {
      name: /Region 10/i,
    });
    expect(selectedRegionElement).toHaveClass('focused');
  });

  test('contains exactly 26 regions', () => {
    render(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    const items = screen.getAllByRole('menuitemradio');
    expect(items.length).toBe(26);
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', () => {
    const mockSetSelectedRegion = jest.fn();
    render(
      <RegionsList
        selectedRegion="Region 1"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const list = screen.getByTestId('list-of-regions');
    const regions = screen.getAllByRole('menuitemradio');

    list.focus();

    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(regions[1]).toHaveFocus();

    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(regions[0]).toHaveFocus();

    fireEvent.keyDown(list, { key: 'Enter' });
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 1/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: ' ' });
    }
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 1/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown on Escape key', () => {
    render(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'Escape' });
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });
});
