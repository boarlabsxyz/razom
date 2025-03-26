import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InitiativesList from './InitiativeList';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { SessionProvider } from 'next-auth/react';
import { gql } from '@apollo/client';

const GET_INITIATIVES_MOCK = {
  request: {
    query: gql`
      query GetInitiatives {
        initiatives {
          id
          name
          initiativeDescription {
            document
          }
        }
      }
    `,
  },
  result: {
    data: {
      initiatives: [
        {
          id: '1',
          name: 'Initiative 1',
          initiativeDescription: {
            document: [
              { children: [{ text: 'This is initiative 1 content' }] },
            ],
          },
        },
        {
          id: '2',
          name: 'Initiative 2',
          initiativeDescription: {
            document: [
              { children: [{ text: 'This is initiative 2 content' }] },
            ],
          },
        },
      ],
    },
  },
};

const AllProviders: React.FC<{
  children: React.ReactNode;
  mocks?: MockedResponse[];
}> = ({ children, mocks = [] }) => (
  <SessionProvider session={null}>
    <MockedProvider mocks={mocks} addTypename={false}>
      {children}
    </MockedProvider>
  </SessionProvider>
);

const customRender = (
  ui: React.ReactElement,
  mocks: MockedResponse[] = [],
  options?: MockedResponse,
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <AllProviders mocks={mocks}>{children}</AllProviders>
    ),
    ...options,
  });

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe('HomePage', () => {
  it('renders loading spinner while fetching data', async () => {
    customRender(<InitiativesList />, [GET_INITIATIVES_MOCK]);

    await waitFor(() =>
      expect(screen.getByTestId('loader')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument(),
    );
  });

  it('displays initiatives once loaded', async () => {
    const initiatives = [
      {
        id: '1',
        name: 'Initiative 1',
        initiativeDescription: {
          document: [{ children: [{ text: 'This is initiative 1 content' }] }],
        },
      },
      {
        id: '2',
        name: 'Initiative 2',
        initiativeDescription: {
          document: [{ children: [{ text: 'This is initiative 2 content' }] }],
        },
      },
    ];

    const GET_INITIATIVES_MOCK = {
      request: {
        query: gql`
          query GetInitiatives {
            initiatives {
              id
              name
              initiativeDescription {
                document
              }
            }
          }
        `,
      },
      result: {
        data: {
          initiatives,
        },
      },
    };

    customRender(<InitiativesList />, [GET_INITIATIVES_MOCK]);

    await waitFor(() =>
      expect(screen.getByTestId('loader')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument(),
    );

    expect(screen.getByText('Initiative 1')).toBeInTheDocument();
    expect(screen.getByText('Initiative 2')).toBeInTheDocument();
  });

  it('displays a message when no initiatives are available', async () => {
    const GET_INITIATIVES_MOCK = {
      request: {
        query: gql`
          query GetInitiatives {
            initiatives {
              id
              name
              initiativeDescription {
                document
              }
            }
          }
        `,
      },
      result: {
        data: {
          initiatives: [],
        },
      },
    };

    customRender(<InitiativesList />, [GET_INITIATIVES_MOCK]);

    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByText('No initiatives available at the moment.'),
    ).toBeInTheDocument();
  });

  it('displays an error message if fetch fails', async () => {
    const GET_INITIATIVES_MOCK = {
      request: {
        query: gql`
          query GetInitiatives {
            initiatives {
              id
              name
              initiativeDescription {
                document
              }
            }
          }
        `,
      },
      error: new Error('Failed to fetch initiatives'),
    };

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    customRender(<InitiativesList />, [GET_INITIATIVES_MOCK]);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText('Failed to fetch initiatives'),
      ).toBeInTheDocument(),
    );

    consoleErrorSpy.mockRestore();
  });
});
