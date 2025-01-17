'use client';

import { usePathname } from 'next/navigation';
import st from './NavMain.module.css';
import NavMenu from '@comComps/NavMenu';

const pages = {
  goal: 'Мета',
  partners: 'Партнери',
  news: 'Новини',
  initiatives: 'Ініціативи',
  events: 'Події',
};

function NavMain() {
  const pathname = usePathname();

  return <NavMenu pages={pages} pathname={pathname} st={st} />;
}

export default NavMain;
