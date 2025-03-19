'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import st from './AuthForm.module.css';
import Link from 'next/link';
import { LoginFormData } from 'types';
import {
  CHECK_USER_QUERY,
  CURRENT_USER_QUERY,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from 'constants/graphql';
import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import LoginAuthButton from './LoginAuthButton';
import { useSession } from 'next-auth/react';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();
  const router = useRouter();
  const { data: session } = useSession();

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      const authResult = data?.authenticateUserWithPassword;

      if (authResult && 'item' in authResult) {
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { authenticatedItem: authResult.item },
        });
        router.push('/');
      } else {
        setError(authResult?.message || 'Невідома помилка входу');
      }
    },
    onError(err) {
      setError(err.message);
    },
  });

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted(data) {
      const createdUser = data?.createUser;

      if (createdUser) {
        router.push('/');
      }
    },
    onError(err) {
      setSubmitError(err.message);
    },
  });

  const hasAuthenticated = useRef(false);
  const password = process.env.NEXT_PUBLIC_AUTH_USER_PASSWORD;

  useEffect(() => {
    async function handleAuth() {
      if (!session || hasAuthenticated.current) {
        return;
      }
      hasAuthenticated.current = true;

      try {
        const { data } = await client.query({
          query: CHECK_USER_QUERY,
          variables: { email: session.user?.email },
          fetchPolicy: 'network-only',
        });

        if (!data?.user) {
          await register({
            variables: {
              name: session.user?.name,
              email: session.user?.email,
              password,
            },
          });
        }

        await login({
          variables: {
            email: session.user?.email,
            password,
          },
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Authentication error:', error);
        hasAuthenticated.current = false;
      }
    }

    handleAuth();
  }, [session, register, login, router]);

  const onSubmit = async (formData: LoginFormData) => {
    setError(null);
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await login({ variables: formData });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={st.container}>
      <form className={st.form} onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <p className={st.error} role="alert">
            {submitError}
          </p>
        )}
        <div className={st.header}>
          {isSubmitting ? <h1>Signing in...</h1> : <h1>Sign in</h1>}
        </div>

        <div className={st['input-group']}>
          <label htmlFor="email" className={st.label}>
            Email
          </label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <input
                type="email"
                id="email"
                placeholder="Email"
                className={`${st.input} ${errors.email ? st['input-error'] : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.email && (
            <p className={st.error} data-testid="email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={st['input-group']}>
          <label htmlFor="password" className={st.label}>
            Password
          </label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <input
                type="password"
                id="password"
                placeholder="Password"
                className={`${st.input} ${errors.password ? st['input-error'] : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.password && (
            <p className={st['input-error']}>{errors.password.message}</p>
          )}
        </div>

        {error && <p className={st['input-error']}>{error}</p>}

        <div className={st['button-container']}>
          <button
            type="submit"
            className={st.button}
            aria-live={isSubmitting ? 'assertive' : 'polite'}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <div className={st.buttonContainer}>
          <LoginAuthButton />
        </div>

        <div className={st['text-container']}>
          <p>
            If you don't have an account, please{' '}
            <Link href="/register">register here</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
