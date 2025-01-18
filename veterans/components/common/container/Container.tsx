import { FC, ReactElement } from 'react';

import styles from './Container.module.css';
import concatClassNames from '@helpers/concatClassNames';

interface IProps {
  children: ReactElement | ReactElement[];
  className?: string;
}

const Container: FC<IProps> = ({ children, className }) => (
  <div className={concatClassNames(styles.container, className)}>
    {children}
  </div>
);

export default Container;
