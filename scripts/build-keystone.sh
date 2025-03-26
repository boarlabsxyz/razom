#!/bin/bash


echo "Starting Keystone build process..."

echo "Generating Prisma client..."
npx prisma generate

echo "Running Keystone build..."
node_modules/.bin/keystone build

echo "Keystone build completed." 