import React from 'react';
import Link from 'next/link';

export interface NavigationMenuProps {
  pages: Record<string, string>;
  pathname: string | null;
  st: Record<string, string>;
}

export default function NavMenu({ pages, pathname, st }: NavigationMenuProps) {
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
