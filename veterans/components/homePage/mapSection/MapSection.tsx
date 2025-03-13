import MapCheckbox from './mapFilters';
import UkraineMap from './map';
import st from './MapSection.module.css';

export default function MapSection() {
  return (
    <section className={st.container}>
      <MapCheckbox />
      <UkraineMap />
    </section>
  );
}
