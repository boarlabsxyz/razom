import UkraineMap from './map/UkraineMap';
import RegionsList from './regionsFilter/regionsList';
import FoundInitiatives from './foundInitiatives';

export default function Initiatives() {
  return (
    <section>
      <RegionsList />
      <UkraineMap />
      <FoundInitiatives />
    </section>
  );
}
