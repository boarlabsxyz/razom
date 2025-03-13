import InitiativesFilter from './initiativesFilter';
import UkraineMap from './map';
import st from './MapSection.module.css';

export default function MapSection() {
  return (
    <section className={st.container}>
      <InitiativesFilter />
      <UkraineMap />
    </section>
  );
}
