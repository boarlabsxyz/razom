import UkraineMap from './map/UkraineMap';
import RegionsList from './regionsFilter/regionsList';
import InitiativesList from './initiativesList';

export default function Initiatives() {
  return (
    <section>
      <RegionsList />
      <UkraineMap />
      <InitiativesList />
    </section>
  );
}
