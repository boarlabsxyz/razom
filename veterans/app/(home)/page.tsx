'use client';

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import Spinner from '@comComps/spinner';
import Container from '@comComps/container';

import { GET_INITIATIVES } from 'constants/graphql';
import { Initiative, ProcessedInitiative, Paragraph, Child } from 'types';

import st from './page.module.css';

function getTextFromParagraph(paragraph: Paragraph): string {
  return paragraph.children.map((child: Child) => child.text).join(' ');
}

function getDescription(description?: {
  document?: Paragraph[];
}): string | null {
  if (!description?.document) {
    return null;
  }
  return description.document.reduce((acc: string, paragraph: Paragraph) => {
    const text = getTextFromParagraph(paragraph);
    return acc ? `${acc}\n${text}` : text;
  }, '');
}

function processInitiative(initiative: Initiative): ProcessedInitiative {
  return {
    id: initiative.id,
    title: initiative.title,
    description: getDescription(initiative.description),
  };
}

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
