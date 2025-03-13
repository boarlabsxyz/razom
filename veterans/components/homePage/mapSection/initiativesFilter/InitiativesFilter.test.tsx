import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckboxGroup } from './InitiativesFilter';

const categoriesList = [
  { id: 'cat-1', name: 'Test Category 1' },
  { id: 'cat-2', name: 'Test Category 2' },
];

describe('CheckboxGroup Component', () => {
  test('renders title correctly', () => {
    render(<CheckboxGroup title="Test Title" categories={categoriesList} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('toggles category list when clicked', () => {
    render(<CheckboxGroup title="Test Title" categories={categoriesList} />);
    const titleElement = screen.getByText('Test Title');

    // Click to open the list
    fireEvent.click(titleElement);

    // Use getByTestId to find the category list
    const categoryList = screen.getByTestId('category-list-test-title-content');
    expect(categoryList).toHaveClass('show');

    // Click to close the list
    fireEvent.click(titleElement);
    expect(categoryList).not.toHaveClass('show');
  });

  test('renders checkboxes correctly', () => {
    render(<CheckboxGroup title="Test Title" categories={categoriesList} />);

    categoriesList.forEach((category) => {
      const checkbox = screen.getByLabelText(category.name);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });
});
