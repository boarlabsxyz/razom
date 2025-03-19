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

const setupRegionsList = () => {
  render(<RegionsList />);
};

const getRegionsList = () => screen.queryByTestId('list-of-regions');

const getAllRegions = () => screen.queryAllByRole('menuitemradio');

const getDropdownButton = () => screen.getByTestId('btn-for-region-selection');

const openDropdown = () => fireEvent.click(getDropdownButton());

const pressKey = (element: HTMLElement, key: string) =>
  fireEvent.keyDown(element, { key });

const selectRegion = (index: number) => {
  fireEvent.click(getAllRegions()[index]);
};

describe('RegionsList Component', () => {
  test('correctly renders and shows default region', () => {
    setupRegionsList();

    expect(getDropdownButton()).toBeInTheDocument();
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('dropdown opens and closes when button is clicked', () => {
    setupRegionsList();

    const button = getDropdownButton();

    fireEvent.click(button);
    expect(getRegionsList()).toBeInTheDocument();

    fireEvent.click(button);
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('contains exactly 26 regions', () => {
    setupRegionsList();

    openDropdown();
    expect(getAllRegions().length).toBe(26);
  });

  test('sets correct focus when reopening dropdown with selected region', async () => {
    setupRegionsList();

    openDropdown();
    // fireEvent.click(getAllRegions()[1]);
    selectRegion(1);

    openDropdown();

    await waitFor(
      () => {
        expect(getAllRegions()[1]).toHaveFocus();
      },
      { timeout: 1000 },
    );
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', () => {
    setupRegionsList();

    openDropdown();
    const regions = getAllRegions();

    // fireEvent.keyDown(regions[0], { key: 'ArrowDown' });
    pressKey(regions[0], 'ArrowDown');
    expect(regions[0]).toHaveFocus();

    // fireEvent.keyDown(regions[0], { key: 'ArrowDown' });
    pressKey(regions[0], 'ArrowDown');
    expect(regions[1]).toHaveFocus();

    // fireEvent.keyDown(regions[1], { key: 'ArrowUp' });
    pressKey(regions[0], 'ArrowUp');
    expect(regions[0]).toHaveFocus();

    // fireEvent.keyDown(regions[0], { key: 'Enter' });
    pressKey(regions[0], 'Enter');
    expect(getDropdownButton()).toHaveTextContent(/Вінницька/i);
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('clears search term with backspace', async () => {
    setupRegionsList();
    openDropdown();

    const list = getRegionsList();
    if (list) {
      fireEvent.keyDown(list, { key: 'в' });
      pressKey(list, 'в');
    }

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBeLessThan(26);
    });

    if (list) {
      fireEvent.keyDown(list, { key: 'Backspace' });
      pressKey(list, 'Backspace');
    }

    await waitFor(() => {
      const allItems = getAllRegions();
      expect(allItems.length).toBe(26);
    });
  });

  test('closes dropdown on Escape key', () => {
    setupRegionsList();

    openDropdown();
    const list = getRegionsList();
    if (list) {
      // fireEvent.keyDown(list, { key: 'Escape' });
      pressKey(list, 'Escape');
    }
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    setupRegionsList();

    openDropdown();
    expect(getRegionsList()).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(getRegionsList()).not.toBeInTheDocument();
  });
});
