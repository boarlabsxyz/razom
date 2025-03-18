import UkraineMap from './map/UkraineMap';
import RegionsList from './regionsFilter/regionsList';
import InitiativesList from './initiativeList';

export default function Initiatives() {
  return (
    <section data-test-id="initiatives-section">
      <RegionsList />
      <UkraineMap />
      <InitiativesList />
    </section>
  );
}
