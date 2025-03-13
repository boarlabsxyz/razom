import { useState } from 'react';
import st from './MapCheckbox.module.css';

type CheckboxGroupProps = {
  title: string;
  categories: string[];
};

const categoriesList1 = [
  'Управління, відділи з ветеранської політики',
  'Фахівець з супроводу',
  'Карʼєрне консультування',
  'Можливості працевлаштування',
  'Ветеранські програми',
  'Освіта та бізнес',
  'Гранти',
  'Юридичне консультування',
  'Хаби',
  'Можливості розвитку та дозвілля',
];

const categoriesList2 = ['Державна', 'Приватна', 'Міжнародна'];

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ title, categories }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleList = () => setIsOpen((prev) => !prev);

  return (
    <div className={st.wrapper}>
      <p
        className={`${st.title} ${isOpen ? st.active : ''}`}
        onClick={toggleList}
      >
        {title}
      </p>
      <div className={`${st.categoryList} ${isOpen ? st.show : ''}`}>
        {categories.map((category, index) => (
          <label key={index} className={st.label}>
            <div className={st.checkboxContainer}>
              <input
                type="checkbox"
                value={category}
                className={st.customCheckbox}
              />
              {category}
            </div>
            <p className={st.numberInfo}>(10)</p>
          </label>
        ))}
      </div>
    </div>
  );
};

export default function MapCheckbox() {
  return (
    <div>
      <CheckboxGroup title="Вид ініціативи" categories={categoriesList1} />
      <CheckboxGroup
        title="Походження ініціативи"
        categories={categoriesList2}
      />
    </div>
  );
}
