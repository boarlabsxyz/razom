'use client';

import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import Link from 'next/link';

export default function RegisterForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.header}>
          <h1>Sing Up</h1>
        </div>

        <p className={styles.subheader}>
          Create your first user to get started
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.label}>Password</legend>
            <div className={styles.passwordGroup}>
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="New Password"
                className={styles.input}
              />
              <input
                type={passwordVisible ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                className={styles.input}
              />
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
