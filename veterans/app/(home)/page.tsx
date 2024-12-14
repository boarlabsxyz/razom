import st from './page.module.css';
import { keystoneContext } from '../../keystone/context';

export default async function HomePage() {
  const posts = await keystoneContext.query.Post.findMany({
    query: `
    id
    title
    content {
      document
    }
  `,
  });

  posts.forEach((post) => {
    post.content = post.content.document
      .map((paragraph) => {
        return paragraph.children.map((child) => child.text).join(' ');
      })
      .join('\n');
  });

  return (
    <main className={st.container}>
      <div>
        <h1>Coming soon...</h1>
        <p>The site is under construction</p>
        <p>Test posts:</p>
        <ul>
          {posts.map((post) => (
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
