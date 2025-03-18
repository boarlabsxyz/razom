import Container from '@comComps/container';
import Hero from '@comps/homePage/hero/Hero';
import MapSection from '@comps/homePage/mapSection';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <MapSection />
    </Container>
  );
}
