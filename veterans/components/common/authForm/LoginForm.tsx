import React from 'react';
import styles from './AuthForm.module.css';
import Link from 'next/link';

export default function LoginForm() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.header}>
          <h1>Sign In</h1>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="identity" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="identity"
            name="identity"
            placeholder="Email"
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            className={styles.input}
          />
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
