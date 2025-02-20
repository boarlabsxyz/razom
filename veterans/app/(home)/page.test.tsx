import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe('HomePage', () => {
  it('renders loading spinner while fetching data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve(
              new Response(JSON.stringify({ data: { initiatives: [] } }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            ),
          100,
        ),
      ),
    );

    await act(async () => {
      render(<HomePage />);
    });

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
        title: 'Initiative 1',
        content: 'This is initiative 1 content',
      },
      {
        id: '2',
        title: 'Initiative 2',
        content: 'This is initiative 2 content',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            initiatives,
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.getByText('Initiative 1')).toBeInTheDocument(),
    );
    expect(screen.getByText('Initiative 2')).toBeInTheDocument();
  });

  it('displays a message when no initiatives are available', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            initiatives: [],
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    render(<HomePage />);

    await waitFor(() =>
      expect(
        screen.getByText('No initiatives available at the moment.'),
      ).toBeInTheDocument(),
    );
  });

  it('displays an error message if fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch initiatives'),
    );

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<HomePage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();

    await waitFor(() =>
      expect(
        screen.getByText('Failed to fetch initiatives'),
      ).toBeInTheDocument(),
    );
    consoleErrorSpy.mockRestore();
  });
});
