import InitiativesFilter from './initiativesFilter';
import UkraineMap from './map';
import st from './MapSection.module.css';
import RegionsList from './regionsFilter';

export default function MapSection() {
  return (
    <section className={st.container}>
      <div className={st.wrapperFilter}>
        <RegionsList />
        <InitiativesFilter />
      </div>
      <UkraineMap />
    </section>
  );
}
