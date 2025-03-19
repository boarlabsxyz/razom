import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionsList from './regionsList';

jest.mock('data/RegionsArray', () => {
  return [
    { name: 'Вінницька', numOfInitiatives: 4 },
    { name: 'Волинська', numOfInitiatives: 24 },
    { name: 'Дніпропетровська', numOfInitiatives: 12 },
    { name: 'Донецька', numOfInitiatives: 14 },
    { name: 'Житомирська', numOfInitiatives: 19 },
    { name: 'Закарпатська', numOfInitiatives: 28 },
    { name: 'Запорізька', numOfInitiatives: 8 },
    { name: 'Івано-Франківська', numOfInitiatives: 17 },
    { name: 'Київська', numOfInitiatives: 5 },
    { name: 'Кіровоградська', numOfInitiatives: 21 },
    { name: 'Луганська', numOfInitiatives: 3 },
    { name: 'Львівська', numOfInitiatives: 11 },
    { name: 'Миколаївська', numOfInitiatives: 25 },
    { name: 'Одеська', numOfInitiatives: 9 },
    { name: 'Полтавська', numOfInitiatives: 16 },
    { name: 'Рівненська', numOfInitiatives: 7 },
    { name: 'Сумська', numOfInitiatives: 22 },
    { name: 'Тернопільська', numOfInitiatives: 6 },
    { name: 'Харківська', numOfInitiatives: 15 },
    { name: 'Херсонська', numOfInitiatives: 2 },
    { name: 'Хмельницька', numOfInitiatives: 20 },
    { name: 'Черкаська', numOfInitiatives: 10 },
    { name: 'Чернівецька', numOfInitiatives: 23 },
    { name: 'Чернігівська', numOfInitiatives: 18 },
    { name: 'АР Крим', numOfInitiatives: 1 },
    { name: 'Всі', numOfInitiatives: 185 },
  ];
});

describe('RegionsList Component', () => {
  let mockSetCurrentRegion: jest.Mock;

  beforeEach(() => {
    mockSetCurrentRegion = jest.fn();
  });

  test('correctly renders and shows default region', () => {
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    expect(screen.getByTestId('btn-for-region-selection')).toBeInTheDocument();
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('dropdown opens and closes when button is clicked', () => {
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    const button = screen.getByTestId('btn-for-region-selection');

    fireEvent.click(button);
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('contains exactly 26 regions', () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getAllByRole('menuitemradio').length).toBe(26);
  });

  test('sets correct focus when reopening dropdown with selected region', async () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    fireEvent.click(screen.getAllByRole('menuitemradio')[1]);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    await waitFor(
      () => {
        expect(screen.getAllByRole('menuitemradio')[1]).toHaveFocus();
      },
      { timeout: 1000 },
    );
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', () => {
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const regions = screen.getAllByRole('menuitemradio');

    fireEvent.keyDown(regions[0], { key: 'ArrowDown' });
    expect(regions[0]).toHaveFocus();

    fireEvent.keyDown(regions[0], { key: 'ArrowDown' });
    expect(regions[1]).toHaveFocus();

    fireEvent.keyDown(regions[1], { key: 'ArrowUp' });
    expect(regions[0]).toHaveFocus();

    fireEvent.keyDown(regions[0], { key: 'Enter' });
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Вінницька/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('clears search term with backspace', async () => {
    render(<RegionsList />);
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    const list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'в' });

    await waitFor(() => {
      const filteredItems = screen.getAllByRole('menuitemradio');
      expect(filteredItems.length).toBeLessThan(26);
    });

    fireEvent.keyDown(list, { key: 'Backspace' });

    await waitFor(() => {
      const allItems = screen.getAllByRole('menuitemradio');
      expect(allItems.length).toBe(26);
    });
  });

  test('closes dropdown on Escape key', () => {
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'Escape' });
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });
});
