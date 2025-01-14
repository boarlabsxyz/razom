'use client';

import { useEffect, useRef, useState } from 'react';
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
  name = 'logotype',
  height = 34,
}: BannerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onClick = () => {
      setIsMenuOpen((prev) => !prev);
      document.body.classList.toggle('no-scroll', !isMenuOpen);
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
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    document.body.classList.remove('no-scroll');
  }, [pathname]);

  const images = Array.from({ length: 3 });

  return (
    <div
      ref={menuRef}
      className={`${st.wrapper} ${isMenuOpen ? st.mobileMenuIsOpen : ''}`}
    >
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
        <div className={st.imgWrapper}>
          {images.map((_, index) => (
            <CustomImage
              key={index}
              className={st.modalImg}
              src={`/img/logo/${name}.svg`}
              alt={name}
              width={492}
              height={height}
              priority
            />
          ))}
        </div>
      </div>
    </div>
  );
}