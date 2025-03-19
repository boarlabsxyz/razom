import React from 'react';
import Hero from './hero/Hero';
import MapSection from './mapSection/MapSection';
import Container from '@comComps/container';

export default function HomePage() {
  return (
    <main>
      <Container>
        <Hero />
        <MapSection />
      </Container>
    </main>
  );
}
