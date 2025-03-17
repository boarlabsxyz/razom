'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import st from './AuthForm.module.css';
import Link from 'next/link';
import { LoginFormData } from 'types';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

type Props = {
  onSubmit: (formData: LoginFormData) => Promise<void>;
  error?: string;
};

export default function LoginForm({ onSubmit, error }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <div className={st.container}>
      <form
        className={st.form}
        onSubmit={handleSubmit(async () => {
          setIsSubmitting(true);
          setSubmitError(null);
          try {
            const values = getValues();
            await onSubmit(values);
          } catch (error) {
            setSubmitError(
              error instanceof Error ? error.message : 'An error occurred',
            );
          } finally {
            setIsSubmitting(false);
          }
        })}
      >
        {submitError && (
          <p className={st.error} role="alert">
            {submitError}
          </p>
        )}
        <div className={st.header}>
          {isSubmitting ? <h1>Signing in...</h1> : <h1>Sign in</h1>}
        </div>

        <div className={st.inputGroup}>
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
                className={`${st.input} ${errors.email ? st.inputError : ''}`}
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

        <div className={st.inputGroup}>
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
                className={`${st.input} ${errors.password ? st.inputError : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.password && (
            <p className={st.error}>{errors.password.message}</p>
          )}
        </div>

        {error && <p className={st.error}>{error}</p>}

        <div className={st.buttonContainer}>
          <button
            type="submit"
            className={st.button}
            aria-live={isSubmitting ? 'assertive' : 'polite'}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className={st.textContainer}>
          <p>
            If you don't have an account, please{' '}
            <Link href="/register">register here</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
