'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';

import { RegisterFormData } from 'types';
import { REGISTER_MUTATION } from 'constants/graphql';
import st from '@comComps/authForm/AuthForm.module.css';

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
  const [confirmedCode, setConfirmedCode] = useState<string>('');
  const stepRef = useRef<'register' | 'verify'>('register');
  const verificationCodeRef = useRef<string>('');

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
    setPasswordVisible((prev) => !prev);
  };

  const CODE_MIN = 1000;
  const CODE_MAX = 9999;

  const handleSendEmail = async (email: string) => {
    const newCode = Math.floor(
      CODE_MIN + Math.random() * (CODE_MAX - CODE_MIN + 1),
    ).toString();
    verificationCodeRef.current = newCode;

    const message = `You need to verify your email address. Enter the following code to verify your email address: ${newCode}`;
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, message }),
      });

      if (response.ok) {
        alert('Verification email sent! Check your inbox.');
        return true;
      } else {
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sending email:', error);
      return false;
    }
  };

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
      await register({ variables: { ...data } });
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      const emailSent = await handleSendEmail(data.email);
      if (!emailSent) {
        setSubmitError('Failed to send verification email.');
      }
    } catch (error) {
      setSubmitError('An error occurred during registration');
    }
  };

  const handleVerifyCode = () => {
    if (confirmedCode === verificationCodeRef.current) {
      router.push('/login');
    } else {
      alert('Invalid verification code');
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
        <div className={st['verify-container']}>
          <h3>Verify your email address</h3>

          <input
            type="text"
            id="confirmEmail"
            placeholder="Email verification"
            className={st.input}
            style={{ textAlign: 'center' }}
            value={confirmedCode}
            onChange={(e) => setConfirmedCode(e.target.value)}
          />

          <button
            type="button"
            className={st.button}
            onClick={handleVerifyCode}
          >
            Ok
          </button>
        </div>
      )}
    </div>
  );
}
