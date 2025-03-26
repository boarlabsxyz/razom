import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

const regions = [
  {
    name: 'Вінницька',
    numOfInitiatives: 0,
    isDefault: false,
    order: 0,
  },
  {
    name: 'Волинська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 1,
  },
  {
    name: 'Дніпропетровська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 2,
  },
  { name: 'Донецька', numOfInitiatives: 0, isDefault: false, order: 3 },
  {
    name: 'Житомирська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 4,
  },
  {
    name: 'Закарпатська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 5,
  },
  {
    name: 'Запорізька',
    numOfInitiatives: 0,
    isDefault: false,
    order: 6,
  },
  {
    name: 'Івано-Франківська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 7,
  },
  { name: 'Київська', numOfInitiatives: 0, isDefault: false, order: 8 },
  {
    name: 'Кіровоградська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 9,
  },
  {
    name: 'Луганська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 10,
  },
  {
    name: 'Львівська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 11,
  },
  {
    name: 'Миколаївська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 12,
  },
  { name: 'Одеська', numOfInitiatives: 0, isDefault: false, order: 13 },
  {
    name: 'Полтавська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 14,
  },
  {
    name: 'Рівненська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 15,
  },
  { name: 'Сумська', numOfInitiatives: 0, isDefault: false, order: 16 },
  {
    name: 'Тернопільська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 17,
  },
  {
    name: 'Харківська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 18,
  },
  {
    name: 'Херсонська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 19,
  },
  {
    name: 'Хмельницька',
    numOfInitiatives: 0,
    isDefault: false,
    order: 20,
  },
  {
    name: 'Черкаська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 21,
  },
  {
    name: 'Чернівецька',
    numOfInitiatives: 0,
    isDefault: false,
    order: 22,
  },
  {
    name: 'Чернігівська',
    numOfInitiatives: 0,
    isDefault: false,
    order: 23,
  },
  { name: 'АР Крим', numOfInitiatives: 0, isDefault: false, order: 24 },
  { name: 'Всі', numOfInitiatives: 0, isDefault: true, order: 25 },
];

export async function main() {
  try {
    await prisma.region.deleteMany({});

    for (const region of regions) {
      await prisma.region.create({ data: region });
    }

    // eslint-disable-next-line no-console
    console.log('✅ Регіони успішно створені');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Помилка при створенні регіонів:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
