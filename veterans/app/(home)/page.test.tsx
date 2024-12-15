import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';
import { keystoneContext } from '../../keystone/context';

jest.mock('../../keystone/context', () => ({
  keystoneContext: {
    query: {
      Post: {
        findMany: jest.fn(),
      },
    },
  },
}));

describe('HomePage', () => {
  it('renders posts fetched from keystoneContext', async () => {
    const mockPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        content: {
          document: [
            {
              type: 'paragraph',
              children: [{ text: 'This is the first post content.' }],
            },
          ],
        },
      },
      {
        id: '2',
        title: 'Test Post 2',
        content: {
          document: [
            {
              type: 'paragraph',
              children: [{ text: 'This is the second post content.' }],
            },
          ],
        },
      },
    ];

    (keystoneContext.query.Post.findMany as jest.Mock).mockResolvedValue(
      mockPosts,
    );

    render(await HomePage());

    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
      expect(
        screen.getByText('This is the first post content.'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('This is the second post content.'),
      ).toBeInTheDocument();
    });
  });

  it('renders fallback UI when no posts are found', async () => {
    (keystoneContext.query.Post.findMany as jest.Mock).mockResolvedValue([]);

    render(await HomePage());

    expect(screen.getByText('Coming soon...')).toBeInTheDocument();
    expect(
      screen.getByText('The site is under construction'),
    ).toBeInTheDocument();
  });
});
