#!/bin/bash
echo "Checking if schema.prisma exists..."
while [ ! -f /usr/src/app/schema.prisma ]; do
    echo "schema.prisma not found, retrying in 30 seconds..."
    sleep 30
done
echo "schema.prisma found!"
