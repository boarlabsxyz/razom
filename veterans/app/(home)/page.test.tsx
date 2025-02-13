import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';

describe('HomePage Component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders loading state initially with pending fetch', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {}));

    render(<HomePage />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders posts after fetching successfully', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Post 1',
        content: {
          document: [
            {
              type: 'paragraph',
              children: [{ text: 'This is the first post.' }],
            },
          ],
        },
      },
    ];

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(mockPosts), {
        status: 200,
        statusText: 'OK',
      }),
    );

    render(<HomePage />);
    expect(screen.queryByTestId('loader')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Post 1/i)).toBeInTheDocument();
      expect(screen.getByText(/This is the first post./i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('handles fetch error gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));

    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<HomePage />);

    await waitFor(() =>
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument(),
    );

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
