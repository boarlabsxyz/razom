type InitiativeContent = {
  type: 'paragraph';
  children: { text: string }[];
};

type Initiative = {
  title: string;
  content: InitiativeContent[];
};

const demoInitiatives: Initiative[] = [
  {
    title: 'Програма працевлаштування ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма спрямована на надання ветеранам доступу до професійного навчання, тренінгів із розвитку навичок та послуг з працевлаштування. Це допомагає їм адаптуватися до нових умов та знайти відповідну роботу. Завдяки цій ініціативі ветерани отримують можливість побудувати нову кар’єру після служби.',
          },
        ],
      },
    ],
  },
  {
    title: 'Психологічна підтримка для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Ініціатива пропонує безкоштовні консультації з професійними психологами та доступ до ресурсів для психічного здоров’я. Учасники отримують допомогу у подоланні стресу, тривоги та інших емоційних проблем. Це сприяє відновленню їхнього психічного стану та поверненню до нормального життя.',
          },
        ],
      },
    ],
  },
  {
    title: 'Допомога з житлом для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма забезпечує доступ до доступного житла, включаючи допомогу з орендою та тимчасовими притулками. Вона також надає консультації з питань вибору житла та юридичного супроводу. Це дає можливість ветеранам та їхнім родинам знайти стабільне місце проживання.',
          },
        ],
      },
    ],
  },
  {
    title: 'Освітні стипендії для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Ветерани можуть отримати фінансову підтримку для навчання у вищих навчальних закладах або на професійних курсах. Це допомагає їм здобути нові знання та розвивати кар’єру в цивільному житті. Крім того, програма сприяє підвищенню їхньої конкурентоспроможності на ринку праці.',
          },
        ],
      },
    ],
  },
  {
    title: 'Програма підтримки ветеранів з інвалідністю',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Забезпечує ветеранів з інвалідністю необхідним обладнанням і адаптацією житлових умов. Програма також включає консультації щодо медичних послуг і доступу до реабілітаційних центрів. Це дозволяє їм жити більш незалежно та комфортно.',
          },
        ],
      },
    ],
  },
  {
    title: 'Юридична допомога для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма пропонує безкоштовну юридичну підтримку у вирішенні правових питань і судових спорів. Вона також допомагає з оформленням документів і поданням запитів до державних органів. Це сприяє захисту прав ветеранів та вирішенню їхніх юридичних проблем.',
          },
        ],
      },
    ],
  },
  {
    title: 'Фінансові консультації для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Надає підтримку в управлінні бюджетом, боргами та податковими питаннями. Програма також допомагає створювати фінансові плани та накопичення. Це забезпечує ветеранів фінансовою стабільністю та впевненістю в майбутньому.',
          },
        ],
      },
    ],
  },
  {
    title: 'Підтримка бізнесу, заснованого ветеранами',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма надає доступ до грантів, наставництва та консультацій для започаткування бізнесу. Вона допомагає розробляти бізнес-плани, залучати інвестиції та будувати мережу контактів. Це сприяє успіху ветеранів у підприємництві.',
          },
        ],
      },
    ],
  },
  {
    title: 'Доступ до медичних послуг для ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Забезпечує доступ до медичних оглядів, лікування та вузькопрофільних спеціалістів. Програма також пропонує профілактичні заходи та вакцинації. Це допомагає ветеранам підтримувати фізичне здоров’я та отримувати необхідну медичну допомогу.',
          },
        ],
      },
    ],
  },
  {
    title: 'Програми підтримки сімей ветеранів',
    content: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Сім’ї ветеранів отримують консультації та тренінги з емоційної підтримки. Програма також пропонує ресурси для покращення сімейних стосунків і подолання кризових ситуацій. Це сприяє створенню гармонійного сімейного середовища.',
          },
        ],
      },
    ],
  },
];

export default demoInitiatives;
