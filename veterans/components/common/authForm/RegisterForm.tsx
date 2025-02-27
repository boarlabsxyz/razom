'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';

import { RegisterFormData } from 'types';
import { REGISTER_MUTATION } from 'constants/graphql';
import styles from '@comComps/authForm/AuthForm.module.css';

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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted(data) {
      const createdUser = data?.createUser;

      if (createdUser) {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      }
    },
    onError(err) {
      setSubmitError(err.message);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);
    try {
      await register({ variables: { ...data } });
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      setSubmitError('An error occurred during registration');
    }
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
                {...field}
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
                {...field}
              />
            )}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div className={styles.inputGroup}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>Password</legend>
            <div className={styles.passwordGroup}>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    placeholder="New Password"
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                    {...field}
                  />
                )}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password.message}</p>
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field }) => (
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                    {...field}
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}

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

        {submitError && <p className={styles.error}>{submitError}</p>}

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
