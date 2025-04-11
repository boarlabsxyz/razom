#!/bin/bash

echo "Starting Keystone build process..."

echo "Generating Prisma client..."
npx prisma generate

echo "Running Keystone build without Admin UI..."
NODE_ENV=production DISABLE_ADMIN_UI=true node_modules/.bin/keystone build

echo "Keystone build completed." 