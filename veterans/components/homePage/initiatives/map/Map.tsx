import { regions } from 'icons/regions';
import st from './Map.module.css';
import InitiativeCount from './InitiativeCount';

export default function Map() {
  return (
    <svg
      max-width="896"
      max-height="597"
      viewBox="0 0 896 597"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="map-title map-desc"
    >
      <title id="map-title">Карта регіонів України</title>
      <desc id="map-desc">
        Карта, що показує регіони України з відповідними підрахунками ініціатив.
      </desc>
      {regions.map(
        ({ id, pathRegion, pathName, pathCircle, regionName, cx, cy }) => (
          <g key={id} aria-labelledby={`region-title-${id}`}>
            <title id={`region-title-${id}`}>{regionName}</title>
            <path d={pathRegion} fill="#DEDEDE" className={st.regionPath} />
            <path d={pathCircle} fill="white" />
            <path d={pathName} fill="#252138" />
            <InitiativeCount cx={cx} cy={cy} />
          </g>
        ),
      )}
    </svg>
  );
}
