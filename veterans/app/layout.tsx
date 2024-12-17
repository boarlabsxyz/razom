import React from 'react';
import { Lato, Golos_Text } from '@next/font/google';
import styles from '../styles/global.css';

const lato = Lato({
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  subsets: ['latin'],
  display: 'swap',
});

const golosText = Golos_Text({
  weight: ['400', '500', '600'],
  variable: '--font-golos-text',
  subsets: ['latin'],
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
      <body>{children}</body>
    </html>
  );
}
