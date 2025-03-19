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
        className={`${st.categoryList} ${isOpen ? st.show : ''}`}
      >
        {categories.map((category, index) => (
          <label
            htmlFor={`checkbox-${category.id}`}
            key={category.id}
            className={st.label}
          >
            <div className={st.checkboxContainer}>
              <input
                id={`checkbox-${category.id}`}
                aria-labelledby={`label-${category.id}`}
                type="checkbox"
                value={category.name}
                checked={!!selectedCheckboxes[category.id]}
                onChange={() => handleCheckboxChange(category.id)}
                className={st.customCheckbox}
              />
              <span id={`label-${category.id}`}>{category.name}</span>
            </div>
            <p className={st.numberInfo}>({index + 1})</p>
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
