#!/bin/bash
echo "Checking if schema.prisma exists..."
while [ ! -f /usr/src/app/shared/schema.prisma ]; do
    echo "schema.prisma not found, retrying in 20 seconds..."
    sleep 20
done
echo "schema.prisma found!"
