import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { CHECK_USER_QUERY, CREATE_USER_MUTATION } from 'constants/graphql';
import { client } from '@lib/apollo';

type User = {
  id: string;
  email: string;
  name: string;
};

interface CheckUserResponse {
  user: User | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: NextAuthUser }) {
      let userData: CheckUserResponse | null = null;

      try {
        const { data } = await client.query<CheckUserResponse>({
          query: CHECK_USER_QUERY,
          variables: { email: user.email || '' },
        });

        userData = data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user data:', error);
      }

      if (userData && !userData.user) {
        await registerUser(user);
      }

      return true;
    },
  },
};

async function registerUser(user: NextAuthUser) {
  try {
    const response = await client.mutate({
      mutation: CREATE_USER_MUTATION,
      variables: {
        email: user.email,
        name: user.name,
      },
    });

    // eslint-disable-next-line no-console
    console.log('User registered successfully:', response.data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error registering user:', error);
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
