import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RegisterPage from './page';

jest.mock('@comComps/authForm/RegisterForm', () => () => (
  <div data-testid="register-form">Mocked RegisterForm</div>
));

describe('RegisterPage', () => {
  it('should render the RegisterForm component', () => {
    render(<RegisterPage />);

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});
