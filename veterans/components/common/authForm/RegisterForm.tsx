'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApolloClient, useMutation } from '@apollo/client';

import { RegisterFormData } from 'types';
import {
  CURRENT_USER_QUERY,
  LOGIN_MUTATION,
  REGISTER_MUTATION,
} from 'constants/graphql';
import st from '@comComps/authForm/AuthForm.module.css';
import { handleSendEmail } from '@helpers/handleSendEmail';
import EmailVerification from './EmailVerification/EmailVerification';

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
    .matches(/\d/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const stepRef = useRef<'register' | 'verify'>('register');
  const verificationCodeRef = useRef<string>('');
  const emailRef = useRef<string>('');
  const client = useApolloClient();

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
    setPasswordVisible((prev) => !prev);
  };

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      const authResult = data?.authenticateUserWithPassword;
      if (authResult && 'item' in authResult) {
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { authenticatedItem: authResult.item },
        });
      } else {
        setSubmitError(
          authResult?.message ?? 'Login failed after registration',
        );
      }
    },
    onError(err) {
      setSubmitError(err.message);
    },
  });

  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted(data) {
      const createdUser = data?.createUser;

      if (createdUser) {
        stepRef.current = 'verify';
      }
    },
    onError(err) {
      setSubmitError(err.message);
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError(null);
    try {
      const { data: responseData } = await register({ variables: { ...data } });

      if (responseData?.createUser) {
        emailRef.current = data.email;
        const { success, code } = await handleSendEmail(data.email);
        if (success && code) {
          verificationCodeRef.current = code;
          await login({
            variables: {
              email: data.email,
              password: data.password,
            },
          });
        } else {
          setSubmitError('Failed to send verification email.');
        }
      }
    } catch (error) {
      setSubmitError('An error occurred during registration');
      throw error;
    }
  };

  return (
    <div className={st.container}>
      {stepRef.current === 'register' ? (
        <form className={st.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={st.header}>
            <h1>Sign Up</h1>
          </div>

          <div className={st['input-group']}>
            <label htmlFor="name" className={st.label}>
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
                  className={`${st.input} ${errors.name ? st['input-error'] : ''}`}
                  {...field}
                />
              )}
            />
            {errors.name && <p className={st.error}>{errors.name.message}</p>}
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
                  {...field}
                />
              )}
            />
            {errors.email && <p className={st.error}>{errors.email.message}</p>}
          </div>

          <div className={st['input-group']}>
            <fieldset className={st.fieldset}>
              <legend className={st.label}>Password</legend>
              <div className={st['password-group']}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="New Password"
                      className={`${st.input} ${errors.password ? st['input-error'] : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <p className={st.error}>{errors.password.message}</p>
                )}

                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      className={`${st.input} ${errors.confirmPassword ? st['input-error'] : ''}`}
                      {...field}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className={st.error}>{errors.confirmPassword.message}</p>
                )}

                <button
                  type="button"
                  className={st['toggle-button']}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? 'Hide' : 'Show'} Password
                </button>
              </div>
            </fieldset>
          </div>

          {submitError && <p className={st.error}>{submitError}</p>}

          <div className={st['button-container']}>
            <button type="submit" className={st.button}>
              Submit
            </button>
          </div>

          <div className={st['text-container']}>
            <p>
              Already have an account? <Link href="/login">Sign in here</Link>.
            </p>
          </div>
        </form>
      ) : (
        <EmailVerification
          verificationCode={verificationCodeRef.current}
          email={emailRef.current}
        />
      )}
    </div>
  );
}
