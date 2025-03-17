import UkraineMap from './map/UkraineMap';
import RegionsList from './regionsFilter/regionsList';

export default function Initiatives() {
  return (
    <section>
      <RegionsList />
      <UkraineMap />
    </section>
  );
}
