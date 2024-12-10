import React from 'react';

import Header from '../components/common/header/Header';
import Banner from '../components/common/header/banner';
import HeaderContent from '../components/common/header/HeaderContent';

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
    <html lang="en">
      <body style={{ margin: 0 }}>
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
