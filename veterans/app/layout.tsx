import React from 'react';
import { Lato, Golos_Text } from 'next/font/google';

import 'styles/global.css';
import Header from '@comComps/header/Header';
import HeaderContent from '@comComps/header/HeaderContent';
import Banner from '@comComps/header/banner';
import Footer from '@comComps/footer/Footer';
import FooterContent from '@comComps/footer/FooterContent';

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
        <Footer>
          <FooterContent>
            <Banner name="logotype" height={34} />
          </FooterContent>
        </Footer>
      </body>
    </html>
  );
}
