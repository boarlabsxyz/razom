import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApolloClient } from '@apollo/client';

import ApolloProviderWrapper from './apollowProvider';

describe('ApolloProviderWrapper', () => {
  it('renders children and provides Apollo Client', () => {
    const TestComponent = () => {
      const client = useApolloClient();
      expect(client).toBeDefined();
      return <div data-testid="child">Test Content</div>;
    };

    const { getByTestId } = render(
      <ApolloProviderWrapper>
        <TestComponent />
      </ApolloProviderWrapper>,
    );

    expect(getByTestId('child')).toHaveTextContent('Test Content');
  });
});
