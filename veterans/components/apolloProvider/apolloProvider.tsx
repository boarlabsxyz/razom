import { ApolloProvider } from '@apollo/client';
import { ErrorBoundary } from 'react-error-boundary';
import { client } from '@lib/apollo';
import React from 'react';

const ErrorFallback: React.FC<{
  error: Error;
  resetErrorBoundary: () => void;
}> = ({ error, resetErrorBoundary }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export default function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ErrorBoundaryAny = ErrorBoundary as any;

  return (
    <ErrorBoundaryAny FallbackComponent={ErrorFallback}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </ErrorBoundaryAny>
  );
}
