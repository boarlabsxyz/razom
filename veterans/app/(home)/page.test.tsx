import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import HomePage from './page';
import { GET_INITIATIVES } from 'constants/graphql';

const mockInitiatives = [
  {
    id: '1',
    title: 'Initiative 1',
    description: {
      document: [{ type: 'paragraph', children: [{ text: 'Description 1' }] }],
    },
  },
  {
    id: '2',
    title: 'Initiative 2',
    description: {
      document: [{ type: 'paragraph', children: [{ text: 'Description 2' }] }],
    },
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

    expect(await screen.findByText('Initiative 1')).toBeInTheDocument();
    expect(await screen.findByText('Initiative 2')).toBeInTheDocument();
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

    expect(await screen.findByText('GraphQL error')).toBeInTheDocument();
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
