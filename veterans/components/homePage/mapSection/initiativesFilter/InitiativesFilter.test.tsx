import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InitiativesFilter, { CheckboxGroup } from './InitiativesFilter';
import { useState } from 'react';

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

  test('selects and unselects a checkbox', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );

    const checkbox = screen.getByLabelText(
      'Test Category 1',
    ) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(setSelectedCheckboxes).toHaveBeenCalled();
  });

  test('navigates through checkboxes with ArrowDown and ArrowUp keys', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );

    const firstCheckbox = screen.getByLabelText('Test Category 1');
    const secondCheckbox = screen.getByLabelText('Test Category 2');

    firstCheckbox.focus();

    fireEvent.keyDown(firstCheckbox, { key: 'ArrowDown' });
    expect(secondCheckbox).toHaveFocus();

    fireEvent.keyDown(secondCheckbox, { key: 'ArrowUp' });
    expect(firstCheckbox).toHaveFocus();
  });

  test('selects and unselects checkbox on Enter or Space key press', () => {
    render(
      <CheckboxGroup
        title="Test Title"
        categories={categoriesList}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />,
    );

    const checkbox = screen.getByLabelText(
      'Test Category 1',
    ) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    fireEvent.keyDown(checkbox, { key: 'Enter' });
    expect(setSelectedCheckboxes).toHaveBeenCalled();

    fireEvent.keyDown(checkbox, { key: ' ' });
    expect(setSelectedCheckboxes).toHaveBeenCalled();
  });
});

describe('InitiativesFilter Component', () => {
  const Wrapper = () => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<
      Record<string, boolean>
    >({});
    return (
      <InitiativesFilter
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />
    );
  };

  test('renders the component with correct sections', () => {
    render(<Wrapper />);

    expect(screen.getByText('Вид ініціативи')).toBeInTheDocument();
    expect(screen.getByText('Походження ініціативи')).toBeInTheDocument();
  });

  test('toggles category list visibility when clicking the button', () => {
    render(<Wrapper />);

    const categoryButton = screen.getByText('Вид ініціативи');
    const categoryList = screen.getByTestId(
      'category-list-вид-ініціативи-content',
    );

    expect(categoryList).not.toHaveClass('show');

    fireEvent.click(categoryButton);
    expect(categoryList).toHaveClass('show');

    fireEvent.click(categoryButton);
    expect(categoryList).not.toHaveClass('show');
  });

  test('selects and unselects a checkbox', () => {
    render(<Wrapper />);

    const checkbox = screen.getByLabelText(
      'Управління, відділи з ветеранської політики',
    ) as HTMLInputElement;

    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
