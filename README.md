# Bookstore Microservices System (Node.js)

A complete microservices-based bookstore system using Node.js, Docker, GitHub Actions, and Google Cloud Run.

## Architecture

- **API Gateway** (Port 3000) - Single entry point, route management, authentication
- **Auth Service** (Port 3001) - User registration, login, JWT management
- **Book Service** (Port 3002) - Book CRUD operations

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- `jq` for integration tests
- GitHub account (for CI/CD)
- Google Cloud account (for deployment)

## Local Development

### Run with Docker Compose

```bash
docker-compose up --build
```

Services will be available at:

- API Gateway: `http://localhost:3000`
- Auth Service: `http://localhost:3001`
- Book Service: `http://localhost:3002`

### Run Integration Tests

```bash
chmod +x ./integration-test.sh
./integration-test.sh
```

## Manual Testing

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get books (use token from login)
curl http://localhost:3000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add book
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Book","author":"Author","price":19.99}'
```

## Deployment

The CI/CD pipeline automatically:

- Runs integration tests on every push
- Builds Docker images
- Pushes images to Docker Hub
- Deploys services to Google Cloud Run on `main`

## Environment Variables

### Auth Service

- `PORT` - Service port (default: 3001)
- `JWT_SECRET` - Secret key for JWT signing

### Book Service

- `PORT` - Service port (default: 3002)

### API Gateway

- `PORT` - Service port (default: 3000)
- `AUTH_SERVICE_URL` - Auth service URL
- `BOOK_SERVICE_URL` - Book service URL

## Testing API Endpoints

### Public Routes

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Protected Routes (require JWT)

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## License

MIT
