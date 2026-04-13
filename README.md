# Bookstore Microservices Node

A simple Node.js microservices demo with:

- `auth-service` for user registration and login
- `book-service` for book catalog data
- `api-gateway` to route requests to backend services

## Run locally

```sh
docker compose up --build
```

Then visit:

- `http://localhost:3000/health`
- `http://localhost:3000/books`
- `http://localhost:3000/auth/health`

## Integration test

```sh
chmod +x ./integration-test.sh
./integration-test.sh
```

## CI/CD

A GitHub Actions workflow is configured in `.github/workflows/ci-cd.yml` to install dependencies, build Docker images, and run the integration test.
