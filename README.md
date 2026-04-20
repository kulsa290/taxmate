# TaxMate

TaxMate is an AI-powered tax assistant web app focused on Indian users. The project combines a React frontend with a Node.js and Express backend to deliver authenticated tax support, AI chat guidance, and a foundation for future compliance workflows.

## Description

TaxMate is built to simplify GST, income tax, TDS, and compliance questions for individuals, freelancers, and small businesses in India. The current version includes a chat-first experience backed by OpenAI, secure user authentication, and persisted chat history using MongoDB.

## Features

- AI chat assistant for Indian tax and compliance questions
- Secure user authentication with protected API routes
- Persistent chat history for signed-in users
- Responsive React interface for ongoing conversations
- Tax calculation modules planned for a future release
- User dashboard planned for a future release

## Tech Stack

- Node.js
- Express
- React
- MongoDB with Mongoose
- OpenAI API
- Tailwind CSS

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/<your-github-username>/taxmate.git
cd taxmate
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
npm --prefix frontend install
```

### 4. Create environment variables

```bash
copy .env.example .env
```

Update `.env` with your MongoDB connection string, JWT secret, and OpenAI API key before starting the app.

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

Open a second terminal and run:

```bash
npm --prefix frontend start
```

The backend runs on `http://localhost:5000` and the frontend runs on `http://localhost:3000`.

## Docker Deployment (Recommended)

For containerized deployment with Docker and Docker Compose:

### Quick Start with Docker

1. **Prerequisites:**
   - Docker Engine 20.10+
   - Docker Compose 2.0+

2. **Clone and setup:**
   ```bash
   git clone https://github.com/<your-github-username>/taxmate.git
   cd taxmate
   cp .env.deploy.example .env
   # Edit .env with your production values
   ```

3. **Development environment:**
   ```bash
   docker-compose up --build
   ```
   - API: `http://localhost:5000`
   - MongoDB: `localhost:27017`
   - Frontend: `http://localhost:3000` (optional)

4. **Production environment:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

5. **Run tests:**
   ```bash
   docker-compose -f docker-compose.test.yml up --build
   ```

For detailed Docker instructions, see `docs/docker-deployment.md`.

## API Setup Guide

The backend expects the following environment variables in `.env`:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-long-random-secret>
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini
```

Notes:

- Keep `.env` local only and never commit it to GitHub.
- Use `.env.example` as the safe template for teammates and deployment platforms.
- On this project, a direct Atlas replica set `mongodb://` URI is more reliable than `mongodb+srv://` on the current Node runtime.

## Available API Routes

- `POST /api/auth/register` to create a user
- `POST /api/auth/login` to authenticate a user
- `POST /api/auth/logout` to end a session for an authenticated user
- `GET /api/auth/me` to fetch the current authenticated profile
- `POST /api/chat` to send a protected chat prompt to the AI assistant
- `GET /api/chat/history` to fetch paginated chat history
- `GET /api/chat/:id` to fetch a single chat by id

## Folder Structure

```text
taxmate/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Future Roadmap

- Add tax calculators for common Indian filing scenarios
- Build a user dashboard for saved chats, reminders, and filing insights
- Add role-based access for users and advisors
- Deploy the backend and frontend to production
- Add analytics, audit logs, and payment-ready plans

## Deployment Options

### Docker Deployment (Recommended)
- **Containerized**: Full-stack deployment with Docker Compose
- **Multi-environment**: Development, testing, and production configurations
- **Scalable**: Easy horizontal scaling and orchestration
- **Secure**: Non-root containers with proper security practices

See `docs/docker-deployment.md` for comprehensive Docker deployment guide.

### Cloud Platform Deployment
- **Railway**: Docker-based deployment with GitHub integration (Recommended for Docker)
- **Render**: API deployment with automated builds
- **Vercel**: Frontend deployment with global CDN

See `docs/railway-deployment.md` for Railway-specific setup.

## License

This project is currently private to the author unless a separate license is added.
- Require at least 1 approval
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Restrict direct pushes to `main`
- Optionally restrict force pushes and branch deletion

Recommended rule for `develop`.

- Require Pull Requests before merging
- Require CI status checks
- Allow maintainers to manage urgent integration work

## GitHub Actions CI/CD

This repository includes a CI workflow at `.github/workflows/ci.yml`.

It does the following on push and Pull Request to `develop` and `main`:

- Installs backend dependencies with `npm ci`
- Installs frontend dependencies with `npm ci`
- Builds the React frontend
- Verifies the backend app loads successfully

### Useful scripts

```bash
npm run verify:backend
npm run build:frontend
```

## Local Development Setup

### Backend

```bash
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables

Never commit real environment files.

- `.env` must stay local or be managed by your deployment platform
- `.env.example` should document required keys without secrets

Backend environment variables used today:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `OPENAI_KEY`
- `OPENAI_MODEL`

## Deployment Recommendation

For a startup-friendly deployment setup:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

Recommended approach:

- Auto-deploy `main` to production
- Auto-deploy `develop` to a staging environment if available
- Store environment variables in platform secrets, never in Git

## Pull Request Checklist

Before opening a PR, confirm:

- You branched from the latest `develop` or `main`
- Your commits are small and readable
- CI passes
- `.env` files are not staged
- README or docs are updated if behavior changed
- UI changes include screenshots

## Team Rules Summary

- `main` is always deployable
- `develop` is the shared integration branch
- Features and bug fixes branch from `develop`
- Hotfixes branch from `main`
- Every merge happens through a Pull Request
- Every release from `develop` to `main` should be intentional and reviewed

## Beginner-Friendly Example Flow

```bash
git checkout develop
git pull origin develop
git checkout -b feature/add-tax-chat-export

# make changes

git add .
git commit -m "feat: add tax chat export action"
git push -u origin feature/add-tax-chat-export
```

Then:

1. Open a Pull Request from `feature/add-tax-chat-export` into `develop`
2. Wait for CI and review approval
3. Merge the PR
4. Delete the branch

## Notes

- Use Node.js 22 LTS in CI and production for stability.
- If Git is not installed locally, install Git before running the repository setup commands.
- For production incidents, prefer a hotfix branch over editing `main` directly.

Endpoint: `POST /api/auth/login`

```json
{
	"email": "test@gmail.com",
	"password": "12345678"
}
```

Example response:

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"token": "YOUR_JWT_TOKEN",
		"user": {
			"id": "...",
			"name": "Kuldeep",
			"email": "test@gmail.com"
		}
	}
}
```

### Get Profile

Endpoint: `GET /api/auth/me`

Header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

### Ask Chat Question

Endpoint: `POST /api/chat/ask`

Header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Request body:

```json
{
	"question": "GST kaise file kare?"
}
```

Example response:

```json
{
	"success": true,
	"message": "Chat created successfully",
	"data": {
		"chat": {
			"id": "...",
			"userId": "...",
			"question": "GST kaise file kare?",
			"answer": "...",
			"createdAt": "...",
			"updatedAt": "..."
		}
	}
}
```

## Postman Setup

### 1. Create Environment Variables

Create a Postman environment and add these variables:

- `base_url` = `http://localhost:5000`
- `token` = leave empty initially

### 2. Login Request URL

Use this URL in Postman:

```text
{{base_url}}/api/auth/login
```

### 3. Login Tests Script

Add this in the `Tests` tab of the login request so Postman saves the JWT automatically:

```javascript
const response = pm.response.json();

if (response.success && response.data && response.data.token) {
  pm.environment.set("token", response.data.token);
}
```

### 4. Protected Route Authorization Header

For protected APIs such as `/api/auth/me`, `/api/chat/create`, and `/api/chat/history`, use:

```text
Authorization: Bearer {{token}}
```

### 5. Suggested Postman Flow

1. Register a user with `POST {{base_url}}/api/auth/register`
2. Login with `POST {{base_url}}/api/auth/login`
3. Let the login test script save the token automatically
4. Call protected routes with `Authorization: Bearer {{token}}`

## Error Responses

Common errors now use the same JSON structure:

```json
{
	"success": false,
	"message": "Invalid token",
	"data": null
}
```