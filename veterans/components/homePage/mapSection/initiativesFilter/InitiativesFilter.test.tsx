import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckboxGroup } from './InitiativesFilter';

const categoriesList = [
  { id: 'cat-1', name: 'Test Category 1' },
  { id: 'cat-2', name: 'Test Category 2' },
];

describe('CheckboxGroup Component', () => {
  let selectedCheckboxes: Record<string, boolean>;
  let setSelectedCheckboxes: jest.Mock;

  beforeEach(() => {
    selectedCheckboxes = {};
    setSelectedCheckboxes = jest.fn((updateFn) => {
      selectedCheckboxes = updateFn(selectedCheckboxes);
    });
  });

  test('renders title correctly', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('toggles category list when clicked', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );
    const titleElement = screen.getByText('Test Title');

    fireEvent.click(titleElement);

    const categoryList = screen.getByTestId('category-list-test-title-content');
    expect(categoryList).toHaveClass('show');

    fireEvent.click(titleElement);
    expect(categoryList).not.toHaveClass('show');
  });

  test('renders checkboxes correctly', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );

    categoriesList.forEach((category) => {
      const checkbox = screen.getByLabelText(category.name);
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });
});
