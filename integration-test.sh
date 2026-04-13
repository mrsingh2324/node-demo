#!/bin/bash
set -e

echo "Waiting for services to be ready..."
sleep 10

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "\n${GREEN}Testing health endpoints...${NC}"
curl -s http://localhost:3000/health | jq '.'
curl -s http://localhost:3001/health | jq '.'
curl -s http://localhost:3002/health | jq '.'

echo -e "\n${GREEN}Testing user registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}')

echo "$REGISTER_RESPONSE" | jq '.'

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')
if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Registration failed - no token received${NC}"
  exit 1
fi

echo -e "${GREEN}Registration successful, token obtained${NC}"

echo -e "\n${GREEN}Testing login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}')

echo "$LOGIN_RESPONSE" | jq '.'
NEW_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$NEW_TOKEN" == "null" ] || [ -z "$NEW_TOKEN" ]; then
  echo -e "${RED}Login failed - no token received${NC}"
  exit 1
fi

echo -e "\n${GREEN}Getting all books...${NC}"
curl -s -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n${GREEN}Adding a new book...${NC}"
ADD_BOOK_RESPONSE=$(curl -s -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Node.js Microservices","author":"John Doe","price":29.99,"isbn":"978-1234567890","stock":15}')

echo "$ADD_BOOK_RESPONSE" | jq '.'

BOOK_ID=$(echo "$ADD_BOOK_RESPONSE" | jq -r '.book.id')
if [ "$BOOK_ID" == "null" ] || [ -z "$BOOK_ID" ]; then
  echo -e "${RED}Failed to add book${NC}"
  exit 1
fi

echo -e "\n${GREEN}Getting single book...${NC}"
curl -s -X GET http://localhost:3000/api/books/$BOOK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n${GREEN}Updating book...${NC}"
curl -s -X PUT http://localhost:3000/api/books/$BOOK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price":24.99,"stock":20}' | jq '.'

echo -e "\n${GREEN}Deleting book...${NC}"
curl -s -X DELETE http://localhost:3000/api/books/$BOOK_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo -e "\n${GREEN}Testing unauthorized access (should fail)...${NC}"
curl -s -X GET http://localhost:3000/api/books \
  -H "Authorization: Bearer invalid-token" | jq '.'

echo -e "\n${GREEN}All integration tests passed!${NC}"
