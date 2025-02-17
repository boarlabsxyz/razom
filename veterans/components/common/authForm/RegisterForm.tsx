'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './AuthForm.module.css';
import Link from 'next/link';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const onSubmit = (data: any) => {
    // eslint-disable-next-line no-console
    console.log('Register Data:', data);
  };

  return (
    <div className={styles.container}>
      <form
        className={styles.form}
        role="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={styles.header}>
          <h1>Sign Up</h1>
        </div>

        <p className={styles.subheader}>
          Create your first user to get started
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <input
                type="text"
                id="name"
                placeholder="Name"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
          {errors.name && <p className={styles.error}>{errors.name.message}</p>}
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
          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>Password</legend>
            <div className={styles.passwordGroup}>
              <div>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="New Password"
                      className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                {errors.password && (
                  <p className={`${styles.error} ${styles.errorPassword}`}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className={`${styles.error} ${styles.errorPassword}`}>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                className={styles.toggleButton}
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? 'Hide' : 'Show'} Password
              </button>
            </div>
          </fieldset>
        </div>

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.button}>
            Get started
          </button>
        </div>

        <div className={styles.textContainer}>
          <p>
            Already have an account? <Link href="/login">Sign in here</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}
