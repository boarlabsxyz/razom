import { useState, useCallback } from 'react';
import regionsArray from 'data/RegionsArray';
import InitiativesFilter from './initiativesFilter';
import UkraineMap from './map';
import st from './MapSection.module.css';
import RegionsFilter from './regionsFilter';

export default function MapSection() {
  const defaultRegion = regionsArray.find(
    (region) => region.name === 'Всі',
  ) || { name: '', numOfInitiatives: 0 };

  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    defaultRegion.name,
  );

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<
    Record<string, boolean>
  >({});

  const handleReset = useCallback(() => {
    setSelectedRegion(defaultRegion.name);
    setSelectedCheckboxes({});
  }, [defaultRegion.name]);

  const hasSelectedCheckboxes = Object.values(selectedCheckboxes).some(
    (value) => value,
  );

  return (
    <section className={st.container}>
      <div className={st['wrapper-filter']}>
        <RegionsList
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />
        <InitiativesFilter
          selectedCheckboxes={selectedCheckboxes}
          setSelectedCheckboxes={setSelectedCheckboxes}
        />
        {(selectedRegion !== defaultRegion.name || hasSelectedCheckboxes) && (
          <button
            type="button"
            className={st['map-button-reset']}
            onClick={handleReset}
          >
            Очистити фільтри
          </button>
        )}
      </div>
      <UkraineMap selectedRegion={selectedRegion} />
    </section>
  );
}
