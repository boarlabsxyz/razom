import { FC } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

import st from './spinner.module.css';

interface IProps {
  loading?: boolean;
  color?: string;
}

const Spinner: FC<IProps> = ({
  loading = true,
  color = 'var(--fiji-green)',
}) => (
  <div className={st.wrapper}>
    <BeatLoader
      color={color}
      loading={loading}
      size={22}
      margin={8}
      speedMultiplier={0.7}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
);

export default Spinner;
