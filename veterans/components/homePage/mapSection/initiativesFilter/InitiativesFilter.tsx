import { useState } from 'react';
import st from './InitiativesFilter.module.css';

interface Category {
  id: string;
  name: string;
}

type CheckboxGroupProps = {
  title: string;
  categories: Category[];
};

const categoriesList1 = [
  { id: 'cat-1', name: 'Управління, відділи з ветеранської політики' },
  { id: 'cat-2', name: 'Фахівець з супроводу' },
  { id: 'cat-3', name: 'Карʼєрне консультування' },
  { id: 'cat-4', name: 'Можливості працевлаштування' },
  { id: 'cat-5', name: 'Ветеранські програми' },
  { id: 'cat-6', name: 'Освіта та бізнес' },
  { id: 'cat-7', name: 'Гранти' },
  { id: 'cat-8', name: 'Юридичне консультування' },
  { id: 'cat-9', name: 'Хаби' },
  { id: 'cat-10', name: 'Можливості розвитку та дозвілля' },
];

const categoriesList2 = [
  { id: 'cat-11', name: 'Державна' },
  { id: 'cat-12', name: 'Приватна' },
  { id: 'cat-13', name: 'Міжнародна' },
];

const CheckboxGroup: React.FC<
  CheckboxGroupProps & {
    selectedCheckboxes: Record<string, boolean>;
    setSelectedCheckboxes: React.Dispatch<
      React.SetStateAction<Record<string, boolean>>
    >;
  }
> = ({ title, categories, selectedCheckboxes, setSelectedCheckboxes }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (id: string) => {
    setSelectedCheckboxes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    categoryId: string,
  ) => {
    const totalCheckboxes = categories.length;
    let nextIndex: number;
    let prevIndex: number;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (index + 1) % totalCheckboxes;
        document
          .getElementById(`checkbox-${categories[nextIndex].id}`)
          ?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        prevIndex = (index - 1 + totalCheckboxes) % totalCheckboxes;
        document
          .getElementById(`checkbox-${categories[prevIndex].id}`)
          ?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleCheckboxChange(categoryId);
        break;
    }
  };

  return (
    <div className={st.wrapper}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`category-list-${title.replace(/\s+/g, '-').toLowerCase()}`}
        className={`${st.title} ${isOpen ? st.active : ''}`}
        onClick={toggleList}
        tabIndex={0}
      >
        {title}
      </button>
      <div
        id={`category-list-${title.replace(/\s+/g, '-').toLowerCase()}-content`}
        data-testid={`category-list-${title.replace(/\s+/g, '-').toLowerCase()}-content`}
        className={`${st['category-list']} ${isOpen ? st.show : ''}`}
      >
        {categories.map((category, index) => (
          <label
            htmlFor={`checkbox-${category.id}`}
            key={category.id}
            className={st.label}
          >
            <div className={st['checkbox-container']}>
              <input
                id={`checkbox-${category.id}`}
                aria-labelledby={`label-${category.id}`}
                type="checkbox"
                value={category.name}
                checked={!!selectedCheckboxes[category.id]}
                onChange={() => handleCheckboxChange(category.id)}
                onKeyDown={(e) => handleKeyDown(e, index, category.id)}
                className={st['custom-checkbox']}
                tabIndex={0}
              />
              <span id={`label-${category.id}`}>{category.name}</span>
            </div>
            <p className={st['number-info']}>({index + 1})</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export { CheckboxGroup };

export default function InitiativesFilter({
  selectedCheckboxes,
  setSelectedCheckboxes,
}: Readonly<{
  selectedCheckboxes: Record<string, boolean>;
  setSelectedCheckboxes: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}>) {
  return (
    <div>
      <CheckboxGroup
        title="Вид ініціативи"
        categories={categoriesList1}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />
      <CheckboxGroup
        title="Походження ініціативи"
        categories={categoriesList2}
        selectedCheckboxes={selectedCheckboxes}
        setSelectedCheckboxes={setSelectedCheckboxes}
      />
    </div>
  );
}
