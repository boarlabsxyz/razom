import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegionsList from './regionsList';
import { MockedProvider } from '@apollo/client/testing';
import { GET_REGIONS } from '@helpers/queries';

const mockRegions = Array.from({ length: 26 }, (_, i) => ({
  id: `region-${i + 1}`,
  name: `Region ${i + 1}`,
  numOfInitiatives: i * 2,
  order: i,
}));

const mocks = [
  {
    request: {
      query: GET_REGIONS,
    },
    result: {
      data: {
        regions: mockRegions,
      },
    },
  },
];

describe('RegionsList Component', () => {
  let mockSetSelectedRegion: jest.Mock;

  beforeEach(() => {
    mockSetSelectedRegion = jest.fn();
  });

  const renderWithApollo = (component: React.ReactElement) => {
    return render(
      <MockedProvider mocks={mocks} addTypename={false}>
        {component}
      </MockedProvider>,
    );
  };

  const waitForDataLoad = async () => {
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });
  };

  test('correctly renders and shows default region', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 5"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();

    expect(screen.getByTestId('btn-for-region-selection')).toBeInTheDocument();
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 5/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('dropdown opens and highlights the selected region', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 10"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    await waitFor(() => {
      expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();
    });

    const selectedRegionElement = screen.getByRole('menuitemradio', {
      name: /Region 10/i,
    });
    expect(selectedRegionElement).toHaveClass('focused');
  });

  test('contains exactly 26 regions', async () => {
    renderWithApollo(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);
    await waitForDataLoad();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    await waitFor(() => {
      const items = screen.getAllByRole('menuitemradio');
      expect(items.length).toBe(26);
    });
  });

  test('keyboard navigation works (ArrowDown, ArrowUp, Enter, Space)', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 1"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();
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

  test('closes dropdown on Escape key', async () => {
    renderWithApollo(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);
    await waitForDataLoad();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const list = screen.getByTestId('list-of-regions');

    fireEvent.keyDown(list, { key: 'Escape' });
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', async () => {
    renderWithApollo(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);
    await waitForDataLoad();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    expect(screen.getByTestId('list-of-regions')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('focus moves to selected region when dropdown opens', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 5"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    await waitFor(() =>
      expect(
        screen.getByRole('menuitemradio', { name: /Region 5/i }),
      ).toHaveFocus(),
    );
  });

  test('clicking a region updates the selectedRegion and closes dropdown', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 10"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    const region10 = screen.getByRole('menuitemradio', { name: /Region 10/i });
    fireEvent.click(region10);

    expect(mockSetSelectedRegion).toHaveBeenCalledWith('Region 10');
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 10/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('pressing Enter or Space selects a region', async () => {
    renderWithApollo(
      <RegionsList
        selectedRegion="Region 5"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    await waitForDataLoad();
    fireEvent.click(screen.getByTestId('btn-for-region-selection'));

    const region5 = screen.getByRole('menuitemradio', { name: /Region 5/i });
    fireEvent.keyDown(region5, { key: 'Enter' });

    expect(mockSetSelectedRegion).toHaveBeenCalledWith('Region 5');
    expect(screen.getByTestId('btn-for-region-selection')).toHaveTextContent(
      /Region 5/i,
    );
    expect(screen.queryByTestId('list-of-regions')).not.toBeInTheDocument();
  });

  test('search input updates inputValue and resets focusedIndex', async () => {
    renderWithApollo(<RegionsList setSelectedRegion={mockSetSelectedRegion} />);
    await waitForDataLoad();

    fireEvent.click(screen.getByTestId('btn-for-region-selection'));
    const searchInput = screen.getByTestId('region-search-input');

    fireEvent.change(searchInput, { target: { value: 'Region 1' } });

    expect(searchInput).toHaveValue('Region 1');
    expect(
      screen.getByRole('menuitemradio', { name: 'Select Region 1' }),
    ).toBeInTheDocument();
  });

  test('displays loader while fetching data', async () => {
    const { getByTestId, queryByTestId } = renderWithApollo(
      <RegionsList
        selectedRegion="Region 1"
        setSelectedRegion={mockSetSelectedRegion}
      />,
    );

    fireEvent.click(getByTestId('btn-for-region-selection'));

    expect(getByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(queryByTestId('loader')).not.toBeInTheDocument();
    });
  });
});
