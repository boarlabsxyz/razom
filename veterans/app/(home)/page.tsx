'use client';

import { useEffect, useState } from 'react';
import st from './page.module.css';

type Post = {
  id: string;
  title: string;
  content: {
    document: {
      type: string;
      children: {
        text: string;
      }[];
    }[];
  };
};

type ProcessedPost = {
  id: string;
  title: string;
  content: string | null;
};

export default function HomePage() {
  const [processedPosts, setProcessedPosts] = useState<ProcessedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const posts: Post[] = await response.json();

        const processed = posts.map((post) => {
          try {
            return {
              ...post,
              content:
                post.content?.document
                  .map((paragraph) =>
                    paragraph.children.map((child) => child.text).join(' '),
                  )
                  .join('\n') ?? null,
            };
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Error processing post ${post.id}:`, error);
            return { ...post, content: null };
          }
        });

        setProcessedPosts(processed);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className={st.container}>
      <div>
        <h1>Coming soon...</h1>
        <p>The site is under construction</p>
        <p>Test posts:</p>
        <ul>
          {processedPosts.map((post) => (
            <li key={post.id}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
