import { regions } from 'icons/regions';
import st from './UkraineMap.module.css';

export default function UkraineMap() {
  return (
    <svg
      viewBox="0 0 896 597"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-test-id="svg-map"
      aria-labelledby="map-title map-desc"
      className={st.iconMap}
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
            className={st.regionGroup}
            aria-labelledby={`region-title-${id}`}
          >
            <title id={`region-title-${id}`}>{regionName}</title>
            <path d={pathRegion} fill="#DEDEDE" className={st.regionPath} />
            <path d={pathCircle} fill="white" />
            <path d={pathName} fill="#252138" />
            <text x={cx} y={cy} fontSize="10" fill="black" textAnchor="middle">
              {index + 1}
            </text>
          </g>
        ),
      )}
    </svg>
  );
}
