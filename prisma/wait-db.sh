#!/bin/sh
# wait-db.sh

# Wait for the database to be ready
while ! nc -z db 3306; do
  echo 'Waiting for the MySQL server to start...';
  sleep 2;
done;

npm run migrate;

npm run start:prod