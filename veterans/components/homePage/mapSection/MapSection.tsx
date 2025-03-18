'use client';

import { useState } from 'react';
import InitiativesFilter from './initiativesFilter';
import UkraineMap from './map';
import st from './MapSection.module.css';
import RegionsFilter from './regionsFilter';

export default function MapSection() {
  const [currentRegion, setCurrentRegion] = useState<string | undefined>();
  return (
    <section className={st.container}>
      <div className={st.wrapperFilter}>
        <RegionsFilter setCurrentRegion={setCurrentRegion} />
        <InitiativesFilter />
      </div>
      <UkraineMap currentRegion={currentRegion} />
    </section>
  );
}
