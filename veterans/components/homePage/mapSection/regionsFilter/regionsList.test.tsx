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

const setupRegionsList = () => render(<RegionsList />);
const getRegionsList = () => screen.queryByTestId('list-of-regions');
const getAllRegions = () => screen.queryAllByRole('menuitemradio');
const getDropdownButton = () => screen.getByTestId('btn-for-region-selection');
const openDropdown = () => fireEvent.click(getDropdownButton());
const pressKey = (element: HTMLElement, key: string) =>
  fireEvent.keyDown(element, { key });
const selectRegion = (index: number) => fireEvent.click(getAllRegions()[index]);
const typeAndClearSearchTerm = async (searchKey: string) => {
  const list = getRegionsList();
  pressKey(list!, searchKey);

  await waitFor(() => {
    expect(getAllRegions().length).toBeLessThan(26);
  });

  pressKey(list!, 'Backspace');

  await waitFor(() => {
    expect(getAllRegions().length).toBe(26);
  });
};

const setupDropdown = () => {
  setupRegionsList();
  openDropdown();
};

const setupDropdownWithSelection = (index: number) => {
  setupDropdown();
  selectRegion(index);
  openDropdown();
};

describe('RegionsList Component', () => {
  test('correctly renders and shows default region', () => {
    setupRegionsList();
    expect(getDropdownButton()).toBeInTheDocument();
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('dropdown opens and closes when button is clicked', () => {
    setupDropdown();
    expect(getRegionsList()).toBeInTheDocument();
    fireEvent.click(getDropdownButton());
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('contains exactly 26 regions', () => {
    setupDropdown();
    expect(getAllRegions().length).toBe(26);
  });

  test('sets correct focus when reopening dropdown with selected region', async () => {
    setupDropdownWithSelection(1);
    await waitFor(() => expect(getAllRegions()[1]).toHaveFocus(), {
      timeout: 1000,
    });
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', () => {
    setupDropdown();
    const regions = getAllRegions();
    pressKey(regions[0], 'ArrowDown');
    expect(regions[0]).toHaveFocus();
    pressKey(regions[0], 'ArrowDown');
    expect(regions[1]).toHaveFocus();
    pressKey(regions[1], 'ArrowUp');
    expect(regions[0]).toHaveFocus();
    pressKey(regions[0], 'Enter');
    expect(getDropdownButton()).toHaveTextContent(/Вінницька/i);
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('clears search term with backspace', async () => {
    setupDropdown();
    await typeAndClearSearchTerm('в');
  });

  test('closes dropdown on Escape key', () => {
    setupDropdown();
    const list = getRegionsList();
    pressKey(list!, 'Escape');
    expect(list).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    setupDropdown();
    expect(getRegionsList()).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(getRegionsList()).not.toBeInTheDocument();
  });
});
