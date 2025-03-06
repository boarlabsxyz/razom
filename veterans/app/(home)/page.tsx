'use client';

import { useEffect, useState } from 'react';
import Spinner from '@comComps/spinner';
import Container from '@comComps/container';

import st from './page.module.css';
import Hero from '@comps/homePage/hero/Hero';

type Initiative = {
  id: string;
  title: string;
  content: {
    document: {
      type: string;
      children: {
        text: string;
      }[];
    }[];
  };
};

type ProcessedInitiative = {
  id: string;
  title: string;
  content: string | null;
};

export default function HomePage() {
  const [processedInitiatives, setProcessedInitiatives] = useState<
    ProcessedInitiative[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitiatives() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                initiatives {
                  id
                  title
                  description {
                    document
                  }
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch initiatives');
        }

        const { data } = await response.json();
        const initiatives: Initiative[] = data.initiatives;

        const processed = initiatives.map((initiative) => ({
          id: initiative.id,
          title: initiative.title,
          content:
            initiative.content?.document
              ?.map((paragraph) =>
                paragraph.children.map((child) => child.text).join(' '),
              )
              .join('\n') ?? null,
        }));

        setProcessedInitiatives(processed);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching initiatives:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchInitiatives();
  }, []);

  return (
    <Container>
      <Hero />
      <section
        className={st.section}
        aria-label="Blog initiatives"
        data-test-id="blog-initiatives"
      >
        {loading && <Spinner />}
        {!loading && error && <p data-test-id="error-message">{error}</p>}
        {!loading && !error && processedInitiatives.length === 0 && (
          <p>No initiatives available at the moment.</p>
        )}
        {!loading && !error && processedInitiatives.length > 0 && (
          <ul>
            {processedInitiatives.map((post) => (
              <li key={post.id}>
                <article>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
