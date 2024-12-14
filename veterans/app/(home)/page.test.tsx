// import '@testing-library/jest-dom';
// import { render, screen } from '@testing-library/react';

// import HomePage from './page';

// describe('HomePage component', () => {
//   it('renders the main content', () => {
//     render(<HomePage />);

//     // const heading = screen.getByRole('heading', { level: 1 });
//     // expect(heading).toHaveTextContent('Coming soon...');

//     // const paragraph = screen.getByText('The site is under construction');
//     // expect(paragraph).toBeInTheDocument();
//   });
// });

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from './page';
import { keystoneContext } from '../../keystone/context';

// Mock keystoneContext
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
    // Mock data returned from keystoneContext
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

    // Render the component
    render(await HomePage());

    // Wait for posts to be rendered
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
    // Mock an empty response from keystoneContext
    (keystoneContext.query.Post.findMany as jest.Mock).mockResolvedValue([]);

    // Render the component
    render(await HomePage());

    // Verify fallback UI is displayed
    expect(screen.getByText('Coming soon...')).toBeInTheDocument();
    expect(
      screen.getByText('The site is under construction'),
    ).toBeInTheDocument();
  });
});
