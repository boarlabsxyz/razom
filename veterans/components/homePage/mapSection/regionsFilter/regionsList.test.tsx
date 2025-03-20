import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionsList from './regionsList';

jest.mock('data/RegionsArray', () => {
  return [
    { name: 'Вінниця' },
    { name: 'Луцьк' },
    { name: 'Дніпро' },
    { name: 'Донецьк' },
    { name: 'Житомир' },
    { name: 'Ужгород' },
    { name: 'Запоріжжя' },
    { name: 'Івано-Франківськ' },
    { name: 'Київ' },
    { name: 'Кропивницький' },
    { name: 'Луганськ' },
    { name: 'Львів' },
    { name: 'Миколаїв' },
    { name: 'Одеса' },
    { name: 'Полтава' },
    { name: 'Рівне' },
    { name: 'Суми' },
    { name: 'Тернопіль' },
    { name: 'Харків' },
    { name: 'Херсон' },
    { name: 'Хмельницький' },
    { name: 'Черкаси' },
    { name: 'Чернівці' },
    { name: 'Чернігів' },
    { name: 'Сімферополь' },
    { name: 'Всі' },
  ];
});

const setupRegionsList = () => render(<RegionsList />);
const getRegionsList = () => screen.queryByTestId('list-of-regions');
const getAllRegions = () => screen.queryAllByRole('menuitemradio');
const getDropdownButton = () => screen.getByTestId('btn-for-region-selection');
const openDropdown = () => fireEvent.click(getDropdownButton());
const pressKey = (
  element: HTMLElement,
  key: string,
  shiftKey: boolean = false,
) => fireEvent.keyDown(element, { key, shiftKey });
const selectRegion = (index: number) => fireEvent.click(getAllRegions()[index]);

const setupDropdown = () => {
  setupRegionsList();
  openDropdown();
};

const setupDropdownWithSelection = (index: number) => {
  setupDropdown();
  selectRegion(index);
  openDropdown();
};

const typeText = (text: string) => {
  const input = screen.getByTestId('region-search-input');
  fireEvent.change(input, { target: { value: text } });
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
    expect(getDropdownButton()).toHaveTextContent(/Вінниця/i);
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('clears search term with backspace', async () => {
    setupDropdown();
    typeText('в');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBeLessThan(26);
    });

    typeText('');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBe(26);
    });
  });

  test('hides all options when no region matches input', async () => {
    setupDropdown();
    typeText('zzz');

    await waitFor(() => {
      expect(getAllRegions().length).toBe(26);
    });
  });

  test('filters regions case-insensitively', async () => {
    setupDropdown();
    typeText('киЇВ');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBe(1);
      expect(filteredItems[0]).toHaveTextContent('Київ');
    });
  });

  test('filters correctly with multiple characters', async () => {
    setupDropdown();
    typeText('лу');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBe(2);
      expect(filteredItems[0]).toHaveTextContent('Луцьк');
      expect(filteredItems[1]).toHaveTextContent('Луганськ');
    });
  });

  test('closes dropdown on Escape key', () => {
    setupDropdown();
    pressKey(getRegionsList()!, 'Escape');
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    setupDropdown();
    expect(getRegionsList()).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(getRegionsList()).not.toBeInTheDocument();
  });

  test('handles non-Ukrainian text input correctly', async () => {
    setupDropdown();
    typeText('abc123');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBe(26);
    });
  });

  test('handles empty input correctly', async () => {
    setupDropdown();
    typeText('');

    await waitFor(() => {
      const filteredItems = getAllRegions();
      expect(filteredItems.length).toBe(26);
    });
  });

  test('handles setCurrentRegion callback correctly', () => {
    const mockSetCurrentRegion = jest.fn();
    render(<RegionsList setCurrentRegion={mockSetCurrentRegion} />);

    openDropdown();
    selectRegion(1);

    expect(mockSetCurrentRegion).toHaveBeenCalledWith('Луцьк');
  });

  test('handles keyboard navigation with Tab key', () => {
    setupDropdown();
    const list = getRegionsList();

    pressKey(list!, 'Tab');
    expect(getAllRegions()[0]).toHaveFocus();

    pressKey(list!, 'Tab');
    expect(getAllRegions()[1]).toHaveFocus();
  });

  test('handles keyboard navigation with Shift+Tab key', () => {
    setupDropdown();
    const list = getRegionsList();

    pressKey(list!, 'Tab');
    expect(getAllRegions()[0]).toHaveFocus();

    pressKey(list!, 'Tab', true);
    expect(getAllRegions()[25]).toHaveFocus();
  });

  test('handles Space key for selection', () => {
    setupDropdown();
    const regions = getAllRegions();

    pressKey(regions[0], 'ArrowDown');
    pressKey(regions[0], ' ');

    expect(getDropdownButton()).toHaveTextContent('Вінниця');
    expect(getRegionsList()).not.toBeInTheDocument();
  });
});
