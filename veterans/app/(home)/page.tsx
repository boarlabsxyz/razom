'use client';

import { useEffect, useState } from 'react';
import Spinner from '@comComps/spinner';
import Container from '@comComps/container';

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
    return <Spinner />;
  }

  return (
    <Container>
      <main className={st.wrapper}>
        <section aria-label="Blog initiatives">
          {processedPosts.length === 0 ? (
            <p>No initiatives available at the moment.</p>
          ) : (
            <ul>
              {processedPosts.map((post) => (
                <li key={post.id}>
                  <article>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </Container>
  );
}
