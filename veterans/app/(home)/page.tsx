'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import Spinner from '@comComps/spinner';
import Container from '@comComps/container';

import { GET_INITIATIVES } from 'constants/graphql';
import { Initiative, ProcessedInitiative } from 'types';

import { processInitiative } from 'utils/initiativeUtils';

import st from './page.module.css';
import Hero from '@comps/homePage/hero/Hero';

export default function HomePage() {
  const { loading, error, data } = useQuery<{ initiatives: Initiative[] }>(
    GET_INITIATIVES,
  );

  const processedInitiatives: ProcessedInitiative[] = useMemo(() => {
    return data?.initiatives ? data.initiatives.map(processInitiative) : [];
  }, [data]);

  let content: JSX.Element;
  if (loading) {
    content = <Spinner />;
  } else if (error) {
    content = <p data-test-id="error-message">{error.message}</p>;
  } else if (processedInitiatives.length === 0) {
    content = <p>No initiatives available at the moment.</p>;
  } else {
    content = (
      <ul>
        {processedInitiatives.map(({ id, title, description }) => (
          <li key={id}>
            <article>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <Container>
      <Hero />
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
