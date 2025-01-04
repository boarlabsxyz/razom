const fs = require('fs');
const path = require('path');

const schemaPath = path.join(process.cwd(), 'veterans/schema.prisma');

if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  if (!schema.includes('binaryTargets')) {
    schema = schema.replace(
      /generator client {/,
      `generator client {
  binaryTargets = ["rhel-openssl-3.0.x"]`,
    );
    fs.writeFileSync(schemaPath, schema);
    console.log('binaryTargets додано до schema.prisma');
  } else {
    console.log('binaryTargets вже існують у schema.prisma');
  }
} else {
  console.error('Файл schema.prisma не знайдено!');
  process.exit(1);
}
