import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import MapSection from './MapSection';
import regionsArray from 'data/RegionsArray';

jest.mock('./initiativesFilter', () => ({
  __esModule: true,
  default: ({
    setSelectedCheckboxes,
  }: {
    selectedCheckboxes: Record<string, boolean>;
    setSelectedCheckboxes: (checkboxes: Record<string, boolean>) => void;
  }) => (
    <div data-testid="initiatives-filter">
      <button onClick={() => setSelectedCheckboxes({ test: true })}>
        Select Filter
      </button>
    </div>
  ),
}));

jest.mock('./map', () => ({
  __esModule: true,
  default: ({ selectedRegion }: { selectedRegion: string }) => (
    <div data-testid="ukraine-map">{selectedRegion}</div>
  ),
}));

jest.mock('./regionsFilter', () => ({
  __esModule: true,
  default: ({
    selectedRegion,
    setSelectedRegion,
  }: {
    selectedRegion?: string;
    setSelectedRegion: (region: string) => void;
  }) => (
    <div data-testid="regions-list">
      <button onClick={() => setSelectedRegion('Київ')}>Select Kyiv</button>
      <span>{selectedRegion}</span>
    </div>
  ),
}));

describe('MapSection Component', () => {
  it('renders correctly', () => {
    render(<MapSection />);
    expect(screen.getByTestId('regions-list')).toBeInTheDocument();
    expect(screen.getByTestId('initiatives-filter')).toBeInTheDocument();
    expect(screen.getByTestId('ukraine-map')).toBeInTheDocument();
  });

  it('updates the selected region when a region is clicked', () => {
    render(<MapSection />);
    const selectRegionButton = screen.getByText('Select Kyiv');
    fireEvent.click(selectRegionButton);
    expect(screen.getByTestId('ukraine-map')).toHaveTextContent('Київ');
  });

  it('shows reset button when filters are applied', () => {
    render(<MapSection />);
    const selectFilterButton = screen.getByText('Select Filter');
    fireEvent.click(selectFilterButton);
    expect(screen.getByText('Очистити фільтри')).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    render(<MapSection />);
    const selectRegionButton = screen.getByText('Select Kyiv');
    fireEvent.click(selectRegionButton);
    const selectFilterButton = screen.getByText('Select Filter');
    fireEvent.click(selectFilterButton);
    const resetButton = screen.getByText('Очистити фільтри');
    fireEvent.click(resetButton);
    expect(screen.getByTestId('ukraine-map')).toHaveTextContent(
      regionsArray.find((r) => r.name === 'Всі області')?.name ?? '',
    );
  });
});
