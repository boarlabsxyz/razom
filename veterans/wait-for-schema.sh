#!/bin/bash
echo "Waiting for schema.prisma to be created..."
while [ ! -f /usr/src/app/veterans/schema.prisma ]; do
    sleep 1
done
echo "schema.prisma found and ready to use!"
