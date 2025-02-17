'use client';

import st from './FooterContent.module.css';

import { usePathname } from 'next/navigation';
import NavMenu from '@comComps/NavMenu';

const pages = {
  about_us: 'Про нас',
  contact_us: "Зв'язатися з нами",
  contacts: 'Контакти',
};

type FooterContentProps = {
  children: React.ReactNode;
};

function FooterContent({ children }: FooterContentProps) {
  const pathname = usePathname();

  return (
    <div className={st.footerWrapper} data-testid="footer">
      <div className={st.footerContainer} data-testid="footerContainer">
        {children}
        <NavMenu pages={pages} pathname={pathname} st={st} />
      </div>
      <div className={st.footerBottom} data-testid="footer-devs">
        <p className={st.footerDevs}> Developed by BoarLabs</p>
      </div>
    </div>
  );
}

export default FooterContent;
