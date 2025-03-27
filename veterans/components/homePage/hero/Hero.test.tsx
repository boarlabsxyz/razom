import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Hero from '@comps/homePage/hero/Hero';

jest.mock('@comComps/customImage', () => () => (
  <div data-testid="custom-image" />
));

describe('Hero Component', () => {
  it('renders without crashing', () => {
    render(<Hero />);

    expect(screen.getByLabelText('Hero section')).toBeInTheDocument();
  });

  it('renders main and secondary text', () => {
    render(<Hero />);

    expect(screen.getByText('ПЛАТФОРМА')).toBeInTheDocument();
    expect(screen.getByText('ІЗ')).toBeInTheDocument();
    expect(screen.getByText('ПОШУКУ ІНІЦІАТИВ')).toBeInTheDocument();
    expect(screen.getByText('ВЕТЕРАНАМ')).toBeInTheDocument();

    expect(
      screen.getByText(
        /Обʼєднуємо ініціативи та їхніх авторів для тих, хто цього потребує/i,
      ),
    ).toBeInTheDocument();
  });

  it('renders the contact button with correct text', () => {
    render(<Hero />);

    const button = screen.getByRole('button', { name: "Зв'язатися з нами" });
    expect(button).toBeInTheDocument();
    expect(screen.getByText(/Зв’язатися з нами/i)).toBeInTheDocument();
  });

  it('renders CustomImage component', () => {
    render(<Hero />);

    expect(screen.getByTestId('custom-image')).toBeInTheDocument();
  });
});
