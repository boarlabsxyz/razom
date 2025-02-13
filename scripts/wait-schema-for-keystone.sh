#!/bin/bash
echo "Checking if schema.prisma exists..."
while [ ! -f /usr/src/app/schema.prisma ]; do
    echo "schema.prisma not found, retrying in 10 seconds..."
    sleep 10
done
echo "schema.prisma found!"
