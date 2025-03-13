import { useState } from 'react';
import InitiativesFilter from './initiativesFilter';
import UkraineMap from './map';
import st from './MapSection.module.css';
import RegionsList from './regionsFilter';

export default function MapSection() {
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>();
  return (
    <section className={st.container}>
      <div className={st.wrapperFilter}>
        <RegionsList setSelectedRegion={setSelectedRegion} />
        <InitiativesFilter />
      </div>
      <UkraineMap selectedRegion={selectedRegion} />
    </section>
  );
}
