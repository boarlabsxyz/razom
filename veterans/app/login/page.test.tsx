import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from './page';

jest.mock('@comComps/authForm/LoginForm', () => () => (
  <div data-testid="login-form">Mocked LoginForm</div>
));

describe('LoginPage', () => {
  it('should render the LoginForm component', () => {
    render(<LoginPage />);

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
