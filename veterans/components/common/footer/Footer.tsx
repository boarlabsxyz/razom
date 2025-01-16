'use client';

import { FC } from 'react';
import Container from '../container';

import st from './Footer.module.css';

type Props = {
  children: React.ReactElement;
};

const Footer: FC<Props> = ({ children }) => {
  return (
    <footer className={st.wrapper} data-cy="footer">
      <Container>{children}</Container>
    </footer>
  );
};

export default Footer;
