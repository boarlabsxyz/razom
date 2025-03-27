'use client';

import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

import Spinner from '@comComps/spinner';

import { Initiative } from 'types';

import st from './InitiativeList.module.css';
import { processInitiatives } from 'utils/initiativeUtils';

const GET_INITIATIVES = gql`
  query GetInitiatives {
    initiatives {
      id
      title
      description {
        document
      }
    }
  }
`;

export default function InitiativesList() {
  const { loading, error, data } = useQuery<{ initiatives: Initiative[] }>(
    GET_INITIATIVES,
  );
  const processedInitiatives = useMemo(() => processInitiatives(data), [data]);

  if (loading) {
    return <Spinner data-testid="loader" />;
  }
  if (error) {
    return <p data-testid="error-message">{error.message}</p>;
  }
  if (processedInitiatives.length === 0) {
    return <p>No initiatives available at the moment.</p>;
  }

  return (
    <div className={st.wrapper} aria-label="Blog initiatives">
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
    </div>
  );
}
