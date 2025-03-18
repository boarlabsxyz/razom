import Container from '@comComps/container';
import Hero from '@comps/homePage/hero/Hero';
import MapSection from '@comps/homePage/mapSection';

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <MapSection />
      <section
        className={st.section}
        aria-label="Blog initiatives"
        data-test-id="blog-initiatives"
      >
        {content}
      </section>
    </Container>
  );
}
