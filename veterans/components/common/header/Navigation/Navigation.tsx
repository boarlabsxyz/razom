'use client';

import { useEffect, useRef, ElementRef } from 'react';
import { usePathname } from 'next/navigation';
import NavMain from './NavMain';
import st from './NavMain.module.css';
import CustomImage from '../../customImage/CustomImage';

type RazomProps = {
  name?: string;
  height?: number;
};

type BannerProps = RazomProps;

export default function Navigation({
  name = 'modal_logo',
  height = 34,
}: BannerProps) {
  const menuRef = useRef<ElementRef<'div'> | null>(null);
  const buttonRef = useRef<ElementRef<'button'> | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onClick = () => {
      if (menuRef.current) {
        menuRef.current.classList.toggle(`${st.mobileMenuIsOpen}`);
        document.body.classList.toggle('no-scroll');
      }
    };

    const menuButtonRef = buttonRef.current;

    if (menuButtonRef) {
      menuButtonRef.addEventListener('click', onClick);
    }

    return () => {
      if (menuButtonRef) {
        menuButtonRef.removeEventListener('click', onClick);
      }
    };
  }, []);

  useEffect(() => {
    if (menuRef.current) {
      menuRef.current.classList.toggle(`${st.mobileMenuIsOpen}`);
      document.body.classList.toggle('no-scroll');
    }
  }, [pathname]);

  return (
    <div ref={menuRef} className={st.wrapper}>
      <button
        ref={buttonRef}
        className={st.mobileMenuButton}
        aria-label="mobile-menu-button"
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div className={st.content}>
        <NavMain />
        <CustomImage
          className={st.modalImg}
          src={`/img/${name}.svg`}
          alt={name}
          width={492}
          height={height}
          priority
        />
      </div>
    </div>
  );
}
