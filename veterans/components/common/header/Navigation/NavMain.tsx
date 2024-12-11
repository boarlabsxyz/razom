'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import st from './NavMain.module.css';

const pages = {
  goal: 'Мета',
  partners: 'Партнери',
  news: 'Новини',
  initiatives: 'Ініціативи',
  events: 'Події',
};

function NavMain() {
  const pathname = usePathname();

  return (
    <nav className={st.navContainer} aria-label="Main navigation">
      <ul className={st.navList}>
        {Object.entries(pages).map(([key, value]) => {
          const isActive = pathname === `/${key}`;
          return (
            <li key={key} data-cy={`${key}-header-link`}>
              <Link
                href={`/${key}`}
                prefetch={false}
                className={`${st.link} ${isActive ? st.active : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {value}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavMain;
