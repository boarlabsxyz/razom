'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AuthForm.module.css';
import Link from 'next/link';
import { LoginFormData } from 'types';
import { CURRENT_USER_QUERY, LOGIN_MUTATION } from 'constants/graphql';
import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import LoginAuthButton from './LoginAuthButton';

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

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      const authResult = data?.authenticateUserWithPassword;

      if (authResult && 'item' in authResult) {
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { authenticatedItem: authResult.item },
        });

        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      } else {
        setError(authResult?.message || 'Невідома помилка входу');
      }
    },
    onError(err) {
      setError(err.message);
    },
  });

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
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {submitError && (
          <p className={styles.error} role="alert">
            {submitError}
          </p>
        )}
        <div className={styles.header}>
          {isSubmitting ? <h1>Signing in...</h1> : <h1>Sign in</h1>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
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
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.email && (
            <p className={styles.error} data-testid="email-error">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
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
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.button}
            aria-live={isSubmitting ? 'assertive' : 'polite'}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        <div className={styles.buttonContainer}>
          <LoginAuthButton />
        </div>

        <div className={styles.textContainer}>
          <p>
            If you don't have an account, please{' '}
            <Link href="/register">register here</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
