export interface Region {
  name: string;
  numOfInitiatives?: number;
}

export interface RegionsListProps {
  setCurrentRegion?: (region: string) => void;
}
