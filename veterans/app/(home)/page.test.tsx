import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from './page';
import { GET_INITIATIVES } from 'constants/graphql';

jest.mock('@comComps/container', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('@comps/homePage/hero/Hero', () => ({
  __esModule: true,
  default: () => <div data-testid="hero">Hero Component</div>,
}));

jest.mock('@comps/homePage/mapSection', () => ({
  __esModule: true,
  default: () => <div data-testid="map-section">Map Section</div>,
}));

const mockInitiatives = [
  {
    id: '1',
    name: 'Initiative 1',
    initiativeDescription: {
      document: [{ type: 'paragraph', children: [{ text: 'Description 1' }] }],
    },
    category: { id: '1', name: 'Category 1', __typename: 'Category' },
    source: { id: '1', name: 'Source 1', __typename: 'Source' },
    region: { id: '1', name: 'Region 1', __typename: 'Region' },
    status: 'Active',
    __typename: 'Initiative',
  },
  {
    id: '2',
    name: 'Initiative 2',
    initiativeDescription: {
      document: [{ type: 'paragraph', children: [{ text: 'Description 2' }] }],
    },
    category: { id: '2', name: 'Category 2', __typename: 'Category' },
    source: { id: '2', name: 'Source 2', __typename: 'Source' },
    region: { id: '2', name: 'Region 2', __typename: 'Region' },
    status: 'Pending',
    __typename: 'Initiative',
  },
];

const mocks = [
  {
    request: {
      query: GET_INITIATIVES,
    },
    result: {
      data: {
        initiatives: mockInitiatives,
        __typename: 'Query',
      },
    },
  },
];

describe('HomePage', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders initiatives after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('map-section')).toBeInTheDocument();

    const initiativesSection = await screen.findByTestId('blog-initiatives');
    expect(initiativesSection).toBeInTheDocument();

    expect(screen.getByText('Initiative 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Initiative 2')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('renders error message on error', async () => {
    const errorMock = [
      {
        request: {
          query: GET_INITIATIVES,
        },
        error: new Error('GraphQL error'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(await screen.findByTestId('error-message')).toHaveTextContent(
      'GraphQL error',
    );
  });

  it('renders message when no initiatives are available', async () => {
    const emptyMock = [
      {
        request: {
          query: GET_INITIATIVES,
        },
        result: {
          data: {
            initiatives: [],
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyMock} addTypename={false}>
        <HomePage />
      </MockedProvider>,
    );

    expect(
      await screen.findByText('No initiatives available at the moment.'),
    ).toBeInTheDocument();
  });
});
