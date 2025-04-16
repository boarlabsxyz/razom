'use client';

import React, { useCallback } from 'react';
import { regions } from 'icons/regions';
import st from './UkraineMap.module.css';

interface UkraineMapProps {
  readonly selectedRegion?: string;
  readonly defaultRegionName: string;
  readonly setSelectedRegion: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

export default function UkraineMap({
  selectedRegion,
  defaultRegionName,
  setSelectedRegion,
}: UkraineMapProps) {
  const handleRegionClick = useCallback(
    (regionName: string) => () => {
      setSelectedRegion((prevSelectedRegion) =>
        prevSelectedRegion === regionName ? defaultRegionName : regionName,
      );
    },
    [setSelectedRegion, defaultRegionName],
  );

  return (
    <svg
      viewBox="0 0 896 597"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="map-title map-desc"
      className={st['icon-map']}
      width="100%"
    >
      <title id="map-title">Карта регіонів України</title>
      <desc id="map-desc">
        Карта, що показує регіони України з відповідними підрахунками ініціатив.
      </desc>
      {regions.map(
        (
          { id, pathRegion, pathName, pathCircle, regionName, cx, cy },
          index,
        ) => (
          <g
            key={id}
            className={st['region-group']}
            aria-labelledby={`region-title-${id}`}
            onClick={handleRegionClick(regionName)}
          >
            <title id={`region-title-${id}`}>{regionName}</title>
            <path
              d={pathRegion}
              fill="#DEDEDE"
              className={`${st['region-path']} ${
                selectedRegion === regionName ? st['selected-region'] : ''
              }`}
            />
            <path d={pathCircle} fill="white" />
            <path d={pathName} fill="#252138" />
            {index !== 16 && index !== 17 && (
              <text
                x={cx}
                y={cy}
                fontSize="10"
                fill="black"
                textAnchor="middle"
              >
                {index + 1}
              </text>
            )}
          </g>
        ),
      )}
    </svg>
  );
}
