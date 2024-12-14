import st from './page.module.css';
import { keystoneContext } from '../../keystone/context';

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

export default async function HomePage() {
  const posts = Array.from(
    await keystoneContext.query.Post.findMany({
      query: `
      id
      title
      content {
        document
      }
    `,
    }),
  ) as Post[];

  const processedPosts: ProcessedPost[] = posts.map((post) => ({
    ...post,
    content: post.content.document
      .map((paragraph) =>
        paragraph.children.map((child) => child.text).join(' '),
      )
      .join('\n'),
  }));

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
