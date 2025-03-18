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
    <div className={st['footer-wrapper']} data-testid="footer">
      <div className={st['footer-container']} data-testid="footerContainer">
        {children}
        <NavMenu pages={pages} pathname={pathname} st={st} />
      </div>
      <div className={st['footer-bottom']} data-testid="footer-devs">
        <p className={st['footer-devs']}> Developed by BoarLabs</p>
      </div>
    </div>
  );
}

export default FooterContent;
