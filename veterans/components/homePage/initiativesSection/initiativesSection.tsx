'use client';

import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import Spinner from '@comComps/spinner';

import { Initiative, ProcessedInitiative, Paragraph, Child } from 'types';

import st from './initiativesSection.module.css';

export default function InitiativesSection() {
  const { loading, error, data } = useQuery<{ initiatives: Initiative[] }>(gql`
    query GetInitiatives {
      initiatives {
        id
        title
        description {
          document
        }
      }
    }
  `);

  const processedInitiatives: ProcessedInitiative[] = useMemo(() => {
    if (!data?.initiatives) {
      return [];
    }

    return data.initiatives.map((initiative) => ({
      id: initiative.id,
      title: initiative.title,
      description:
        initiative.description?.document?.reduce(
          (acc: string, paragraph: Paragraph) => {
            const text = paragraph.children
              .map((child: Child) => child.text)
              .join(' ');
            return acc ? `${acc}\n${text}` : text;
          },
          '',
        ) ?? null,
    }));
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
    <section
      className={st.section}
      aria-label="Blog initiatives"
      data-test-id="blog-initiatives"
    >
      {content}
    </section>
  );
}
