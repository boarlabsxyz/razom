import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionsList from './regionsList';

jest.mock('data/RegionsArray', () =>
  Array.from({ length: 26 }, (_, i) => ({
    name: `Region ${i + 1}`,
    numOfInitiatives: i * 2,
  })),
);

describe('RegionsList Component', () => {
  test('correctly renders and shows default region', () => {
    render(<RegionsList />);

    expect(screen.getByTestId('btn-for-region-selection')).toBeInTheDocument();
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('dropdown opens and closes when button is clicked', () => {
    render(<RegionsList />);

    const button = screen.getByTestId('btn-for-region-selection');

    fireEvent.click(button);
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('contains exactly 26 regions', () => {
    render(<RegionsList />);
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(26);
  });

  test('sets correct focus when reopening dropdown with selected region', async () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    fireEvent.click(screen.getAllByRole('listitem')[1]);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    await waitFor(
      () => {
        expect(screen.getAllByRole('listitem')[1]).toHaveFocus();
      },
      { timeout: 1000 },
    );
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    let list = screen.getByTestId('list-of-regions');
    const regions = screen.getAllByRole('listitem');

    list.focus();

    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(regions[1]).toHaveFocus();

    fireEvent.keyDown(list, { key: 'ArrowDown' });
    expect(regions[2]).toHaveFocus();

    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(regions[1]).toHaveFocus();

    fireEvent.keyDown(list, { key: 'Enter' });
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 2/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'ArrowDown' });
    if (document.activeElement) {
      fireEvent.keyDown(document.activeElement, { key: ' ' });
    }
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 3/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown on Escape key', () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'Escape' });
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(<RegionsList />);

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });
});
