'use client';

import { FC, useEffect, useRef } from 'react';

import st from './Header.module.css';
import { throttle } from '@helpers/throttle';
import Container from '@comComps/container';

type Props = {
  children: React.ReactElement;
};

const Header: FC<Props> = ({ children }) => {
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = throttle(() => {
      const scrollThreshold = 2;
      const bodyScrollTop = document.body.scrollTop;
      const htmlScrollTop = document.documentElement.scrollTop;
      const force =
        bodyScrollTop > scrollThreshold || htmlScrollTop > scrollThreshold;

      headerRef.current?.classList.toggle(st.bottomBorder, force);
    }, 100);

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className={st.wrapper} data-cy="header">
      <Container>{children}</Container>
    </header>
  );
};

export default Header;
