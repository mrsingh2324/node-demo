#!/bin/sh
set -e

echo "Starting services..."
docker compose up -d

printf 'Waiting for gateway...'
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl --silent --fail http://localhost:3000/health >/dev/null 2>&1; then
    echo " ready"
    break
  fi
  printf '.'
  sleep 2
  if [ "$i" -eq 10 ]; then
    echo "\nGateway did not become ready in time"
    docker compose logs
    exit 1
  fi
 done

printf 'Verifying /books endpoint... '
response=$(curl --silent --fail http://localhost:3000/books)
echo "$response" | grep -q 'The Art of Microservices'

echo 'Verifying /auth/health proxy... '
proxyResponse=$(curl --silent --fail http://localhost:3000/auth/health)
echo "$proxyResponse" | grep -q 'auth'

echo 'Integration checks passed.'

docker compose down
