'use client';
import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { client } from '@lib/apollo';
import React from 'react';

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

const ErrorBoundaryWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
);

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundaryWrapper>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ErrorBoundaryWrapper>
  );
}
