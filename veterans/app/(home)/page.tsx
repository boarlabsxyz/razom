'use client';

import Container from '@comComps/container';
import Hero from '@comps/homePage/hero/Hero';
import MapSection from '@comps/homePage/mapSection';
import InitiativesList from '@comps/homePage/mapSection/initiativeList';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <MapSection />
      <InitiativesList />
    </Container>
  );
}
