import React from 'react';
import { Lato, Golos_Text } from 'next/font/google';
import Header from '../components/common/header/Header';
import Banner from '../components/common/header/banner';
import HeaderContent from '../components/common/header/HeaderContent/HeaderContent';
import '../styles/global.css';

const lato = Lato({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  subsets: ['latin'],
  display: 'swap',
});

const golosText = Golos_Text({
  weight: ['400', '500', '600'],
  variable: '--font-golos-text',
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata = {
  title: 'Razom for veterans',
  description:
    'Razom - portal for helping veterans get reintegrated into society',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${golosText.variable}`}>
      <body>
        <Header>
          <HeaderContent>
            <Banner name="logotype" height={34} />
          </HeaderContent>
        </Header>
        <main>{children}</main>
      </body>
    </html>
  );
}
