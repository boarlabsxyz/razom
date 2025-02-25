import React from 'react';
import Link from 'next/link';

import LogoutButton from './LogoutButton';
import { useUser } from 'hooks/useUser';

export interface NavigationMenuProps {
  pages: Record<string, string>;
  pathname: string | null;
  st: Record<string, string>;
}

export default function NavMenu({ pages, pathname, st }: NavigationMenuProps) {
  const { user } = useUser();

  return (
    <nav className={st.navContainer} aria-label="Menu navigation">
      <ul className={st.navList}>
        {Object.entries(pages).map(([key, value]) => {
          const isActive = pathname === `/${key}`;
          if (key === 'login' && user) {
            return (
              <li key={key} data-cy={`${key}-navMenu-link`}>
                <LogoutButton />
              </li>
            );
          }
          return (
            <li key={key} data-cy={`${key}-navMenu-link`}>
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
