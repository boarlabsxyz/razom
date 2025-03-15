import Container from '@comComps/container';
import Hero from '@comps/homePage/hero/Hero';
import InitiativesSection from '@comps/homePage/initiativesSection';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <InitiativesSection />
    </Container>
  );
}
