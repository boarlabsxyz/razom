import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Container from './Container';

describe('Container Component', () => {
  it('renders the children correctly', () => {
    render(
      <Container>
        <p>Test Child</p>
      </Container>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('applies default className', () => {
    render(
      <Container>
        <p>Test Child</p>
      </Container>,
    );

    const containerElement = screen.getByText('Test Child').parentElement;
    expect(containerElement).toHaveClass('container');
  });

  it('merges additional className', () => {
    render(
      <Container className="additional-class">
        <p>Test Child</p>
      </Container>,
    );

    const containerElement = screen.getByText('Test Child').parentElement;
    expect(containerElement).toHaveClass('container');
    expect(containerElement).toHaveClass('additional-class');
  });

  it('renders multiple children', () => {
    render(
      <Container>
        <p>Child 1</p>
        <p>Child 2</p>
      </Container>,
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });
});
