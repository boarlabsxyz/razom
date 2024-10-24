import React from 'react';

export const metadata = {
  title: 'Razom for veterans',
  description:
    'Razom - portal for helping veterans get reintegrated into society',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
