import Container from '@comComps/container';
import Hero from '@comps/homePage/hero/Hero';
import Initiatives from '@comps/homePage/initiatives/Initiatives';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <Initiatives />
    </Container>
  );
}
