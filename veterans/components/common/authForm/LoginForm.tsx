'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AuthForm.module.css';
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
};

export default function LoginForm({ onSubmit }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        role="form"
        onSubmit={handleSubmit(() => {
          const values = getValues();
          onSubmit(values);
        })}
      >
        <div className={styles.header}>
          <h1>Sign In</h1>
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

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Sign in
          </button>
        </div>

        <div className={styles.textContainer}>
          <p>
            If you don’t have an account, please{' '}
            <Link href="/register">register here</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
