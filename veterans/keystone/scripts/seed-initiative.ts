import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const categories = [
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

const sources = ['Державна', 'Приватна', 'Міжнародна'];

const initiatives = [
  {
    title: 'Центр зайнятості ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          { text: 'Державний центр допомоги з працевлаштування ветеранів' },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Державна',
    region: 'Київська',
    status: 'pending',
  },
  {
    title: 'Ветеранський хаб',
    description: [
      {
        type: 'paragraph',
        children: [{ text: 'Місце для спілкування та підтримки ветеранів' }],
      },
    ],
    category: 'Хаби',
    source: 'Приватна',
    region: 'Львівська',
    status: 'pending',
  },
  {
    title: 'Програма працевлаштування ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Місце для спілкування та підтримки ветеранівПрограма спрямована на надання ветеранам доступу до професійного навчання...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Приватна',
    region: 'Волинська',
    status: 'pending',
  },
  {
    title: 'Психологічна підтримка для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Ініціатива пропонує безкоштовні консультації з професійними психологами...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Волинська',
    status: 'pending',
  },
  {
    title: 'Волонтерські програми для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Залучення ветеранів до волонтерської діяльності...',
          },
        ],
      },
    ],
    category: 'Карʼєрне консультування',
    source: 'Міжнародна',
    region: 'Волинська',
    status: 'pending',
  },
  {
    title: 'Допомога з житлом для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма забезпечує доступ до доступного житла...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Дніпропетровська',
    status: 'pending',
  },
  {
    title: 'Культурні заходи для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Відвідування музеїв, виставок та театрів...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Дніпропетровська',
    status: 'pending',
  },
  {
    title: 'Спортивні програми для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Організація спортивних заходів для ветеранів...',
          },
        ],
      },
    ],
    category: 'Гранти',
    source: 'Державна',
    region: 'Донецька',
    status: 'pending',
  },
  {
    title: 'Програми підтримки сімей ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: "Сім'ї ветеранів отримують консультації та тренінги...",
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Державна',
    region: 'Житомирська',
    status: 'pending',
  },
  {
    title: 'Доступ до медичних послуг для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Забезпечує доступ до медичних оглядів, лікування...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Житомирська',
    status: 'pending',
  },
  {
    title: 'Підтримка бізнесу, заснованого ветеранами',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма надає доступ до грантів, наставництва...',
          },
        ],
      },
    ],
    category: 'Освіта та бізнес',
    source: 'Державна',
    region: 'Закарпатська',
    status: 'pending',
  },
  {
    title: 'Фінансові консультації для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Надає підтримку в управлінні бюджетом, боргами...',
          },
        ],
      },
    ],
    category: 'Освіта та бізнес',
    source: 'Державна',
    region: 'Закарпатська',
    status: 'pending',
  },
  {
    title: 'Юридична допомога для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Програма пропонує безкоштовну юридичну підтримку...',
          },
        ],
      },
    ],
    category: 'Гранти',
    source: 'Міжнародна',
    region: 'Запорізька',
    status: 'pending',
  },
  {
    title: 'Програма підтримки ветеранів з інвалідністю',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Забезпечує ветеранів з інвалідністю необхідним обладнанням...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Запорізька',
    status: 'pending',
  },
  {
    title: 'Освітні стипендії для ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Ветерани можуть отримати фінансову підтримку для навчання...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Івано-Франківська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів-підприємців',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Допомога у відкритті та розвитку бізнесу...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Державна',
    region: 'Івано-Франківська',
    status: 'pending',
  },
  {
    title: 'Програми навчання іноземним мовам',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Безкоштовні курси іноземних мов для ветеранів...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Приватна',
    region: 'Івано-Франківська',
    status: 'pending',
  },
  {
    title: 'Допомога у пошуку роботи за кордоном',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Консультації та підтримка у пошуку роботи за кордоном...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Приватна',
    region: 'Івано-Франківська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки творчості ветеранів',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Виставки творчих робіт ветеранів...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Міжнародна',
    region: 'Кіровоградська',
    status: 'pending',
  },
  {
    title: 'Програми обміну досвідом між ветеранами',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Обмін досвідом та підтримка між ветеранами...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Міжнародна',
    region: 'Миколаївська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері мистецтва',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Майстер-класи та виставки для ветеранів-митців...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Міжнародна',
    region: 'Чернівецька',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері туризму',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Організація екскурсій та поїздок для ветеранів...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Державна',
    region: 'Хмельницька',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері екології',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Залучення ветеранів до екологічних проектів...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Державна',
    region: 'Хмельницька',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері освіти',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Можливість отримання додаткової освіти та підвищення кваліфікації...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Державна',
    region: 'Тернопільська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері науки',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Залучення ветеранів до наукових досліджень та проектів...',
          },
        ],
      },
    ],
    category: 'Можливості розвитку та дозвілля',
    source: 'Міжнародна',
    region: 'Тернопільська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері спорту',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Організація спортивних змагань та тренувань для ветеранів...',
          },
        ],
      },
    ],
    category: 'Можливості працевлаштування',
    source: 'Приватна',
    region: 'Тернопільська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері культури',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Організація культурних заходів та фестивалів для ветеранів...',
          },
        ],
      },
    ],
    category: 'Ветеранські програми',
    source: 'Приватна',
    region: 'Рівненська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері соціальних послуг',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Надання соціальних послуг та допомоги ветеранам...',
          },
        ],
      },
    ],
    category: 'Ветеранські програми',
    source: 'Приватна',
    region: 'Рівненська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері безпеки',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Залучення ветеранів до проектів з безпеки та оборони...',
          },
        ],
      },
    ],
    category: 'Фахівець з супроводу',
    source: 'Міжнародна',
    region: 'Полтавська',
    status: 'pending',
  },
  {
    title: 'Програми підтримки ветеранів у сфері міжнародних відносин',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Залучення ветеранів до міжнародних проектів та обмінів...',
          },
        ],
      },
    ],
    category: 'Фахівець з супроводу',
    source: 'Міжнародна',
    region: 'Полтавська',
    status: 'pending',
  },
];

export async function main() {
  try {
    await prisma.initiative.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.source.deleteMany({});

    for (const title of categories) {
      await prisma.category.create({
        data: { title },
      });
    }

    // eslint-disable-next-line no-console
    console.log('✅ Категорії успішно створені');

    for (const title of sources) {
      await prisma.source.create({
        data: { title },
      });
    }

    // eslint-disable-next-line no-console
    console.log('✅ Джерела успішно створені');

    const [allCategories, allSources, allRegions] = await Promise.all([
      prisma.category.findMany(),
      prisma.source.findMany(),
      prisma.region.findMany(),
    ]);

    for (const initiative of initiatives) {
      const categoryId = allCategories.find(
        (cat) => cat.title === initiative.category,
      )?.id;
      const sourceId = allSources.find(
        (src) => src.title === initiative.source,
      )?.id;
      const regionId = allRegions.find(
        (reg) => reg.name === initiative.region,
      )?.id;

      if (!categoryId || !sourceId || !regionId) {
        // eslint-disable-next-line no-console
        console.log('✅ Ініціативи успішно створені');
        throw new Error(
          `Не знайдено необхідні дані для ініціативи: ${initiative.title}`,
        );
      }

      await prisma.initiative.create({
        data: {
          title: initiative.title,
          description: initiative.description,
          category: { connect: { id: categoryId } },
          source: { connect: { id: sourceId } },
          region: { connect: { id: regionId } },
          status: initiative.status,
          archived: false,
        },
      });
    }

    // eslint-disable-next-line no-console
    console.log('✅ Ініціативи успішно створені');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Помилка при заповненні бази даних:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
