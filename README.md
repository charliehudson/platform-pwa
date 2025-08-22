# Policy Pilot PWA

An AI-powered insurance policy analysis and recommendations platform built with Next.js 14, featuring RAG-powered insights, document intelligence, and intelligent policy comparisons.

## 🚀 Features

- **AI-Powered Analysis**: Advanced language models analyze policy documents for key insights
- **Document Intelligence**: Upload and process insurance policies, quotes, and related documents
- **Smart Recommendations**: Get personalized policy recommendations with transparent scoring
- **RAG-Powered Chat**: Conversational AI assistant grounded in your policy documents
- **PWA Support**: Full Progressive Web App with offline capabilities
- **Multi-Provider LLM**: Support for OpenAI, Azure OpenAI, and OpenRouter
- **Vector Search**: pgvector integration for semantic document search
- **Secure Storage**: S3-compatible storage with signed URLs and encryption

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: TailwindCSS, Radix UI, Headless UI
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: NextAuth.js with credentials provider
- **AI/LLM**: LangChain with provider-agnostic LLM support
- **Storage**: S3-compatible (MinIO/R2) with signed URLs
- **PWA**: next-pwa with Workbox service worker
- **Validation**: Zod schemas for runtime validation
- **Testing**: Jest, Playwright for E2E testing

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- PostgreSQL 16+ (for production)
- MinIO or S3-compatible storage
- OpenAI API key (or alternative LLM provider)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd insurance-copilot-pwa
npm install
```

### 2. Environment Setup

Copy the environment template and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/insurance_copilot?schema=public"

# AI/LLM
OPENAI_API_KEY="your-openai-api-key"
LLM_PROVIDER="openai"
EMBEDDINGS_MODEL="text-embedding-3-large"

# Storage
S3_ENDPOINT="http://localhost:9000"
S3_BUCKET="insurance-copilot"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"

# Authentication
AUTH_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Start Infrastructure

```bash
# Start PostgreSQL, MinIO, and Redis
npm run docker:up

# Wait for services to be healthy, then generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:e2e        # Run E2E tests with Playwright

# Utilities
npm run ingest          # Run document ingestion
npm run type-check      # TypeScript type checking
npm run lint            # ESLint checking

# Docker
npm run docker:up       # Start infrastructure
npm run docker:down     # Stop infrastructure
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Dashboard pages
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── providers.tsx      # Context providers
├── lib/                    # Core libraries
│   ├── auth.ts            # Authentication configuration
│   ├── db.ts              # Database client
│   ├── ai.ts              # AI/LLM service
│   ├── rag.ts             # RAG service
│   ├── storage.ts         # Storage service
│   ├── schemas.ts         # Zod validation schemas
│   └── utils.ts           # Utility functions
└── types/                  # TypeScript type definitions

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations

scripts/
├── seed.ts                # Database seeding
└── ingest.ts              # Document ingestion

docker/
├── docker-compose.yml     # Infrastructure setup
└── init.sql               # PostgreSQL initialization
```

## 🔐 Authentication

The application uses NextAuth.js with a credentials provider:

- **Sign Up**: Create account with email/password
- **Sign In**: Authenticate with credentials
- **Session Management**: JWT-based sessions with role-based access
- **Password Security**: bcrypt hashing with salt rounds

## 📊 Database Schema

### Core Models

- **User**: Authentication and profile information
- **Profile**: Extended user profile with preferences
- **InsuranceRequest**: Insurance requests with status lifecycle
- **Document**: Uploaded documents with metadata
- **PolicyChunk**: Vectorized policy content for RAG
- **ChatSession**: AI chat conversations
- **Message**: Individual chat messages with citations

### Status Lifecycle

```
DRAFT → SUBMITTED → NEEDS_INFO → IN_REVIEW → READY → ARCHIVED
```

## 🤖 AI & RAG Pipeline

### Document Processing

1. **Upload**: Documents uploaded to S3-compatible storage
2. **Parsing**: PDF/HTML/Docx parsing with fallback strategies
3. **Chunking**: Semantic chunking with overlap (800 tokens, 120 overlap)
4. **Embedding**: Vector generation using configured embeddings model
5. **Storage**: Chunks stored in pgvector with metadata

### RAG Query Flow

1. **Query Processing**: User question + request context
2. **Vector Search**: Semantic similarity search in policy chunks
3. **Context Retrieval**: Top-K relevant chunks retrieved
4. **Answer Generation**: LLM generates grounded response with citations
5. **Response**: Streaming response with confidence scores and disclaimers

### Safety Features

- **No Price Fabrication**: LLM instructed to never guess prices
- **Citation Requirements**: All claims must be backed by policy chunks
- **Confidence Scoring**: Transparent confidence levels for responses
- **Disclaimer**: Financial advice disclaimers on all responses

## 📱 PWA Features

- **Service Worker**: Workbox-based with runtime caching strategies
- **Offline Support**: Cached app shell and last session data
- **Install Prompt**: Native app installation experience
- **Push Notifications**: Status updates and alerts (stub implementation)
- **Manifest**: Complete PWA manifest with icons and metadata

## 🧪 Testing

### Unit Tests

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode for development
```

### E2E Tests

```bash
npm run test:e2e          # Run Playwright tests
```

Test coverage includes:
- API endpoint validation
- Authentication flows
- Document processing
- RAG pipeline
- UI component behavior

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Docker Deployment

```bash
# Build production image
docker build -t insurance-copilot .

# Run with environment variables
docker run -p 3000:3000 --env-file .env.production insurance-copilot
```

### Environment Variables

Required for production:
- `DATABASE_URL`: Production PostgreSQL connection
- `S3_ENDPOINT`: Production S3 endpoint
- `S3_ACCESS_KEY_ID`: Production S3 credentials
- `S3_SECRET_ACCESS_KEY`: Production S3 credentials
- `AUTH_SECRET`: Secure random string
- `NEXTAUTH_SECRET`: Secure random string
- `LLM_PROVIDER`: AI provider configuration
- `OPENAI_API_KEY`: LLM API key

## 🔒 Security Features

- **Input Validation**: Zod schemas for all API inputs
- **Authentication**: JWT-based sessions with secure cookies
- **Authorization**: Role-based access control (USER/ADMIN)
- **Rate Limiting**: API rate limiting for chat and uploads
- **CSP**: Content Security Policy headers
- **HTTPS**: Secure cookie settings
- **PII Protection**: Logging and prompt sanitization

## 📈 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with levels
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance**: Response time monitoring for AI calls
- **Usage Analytics**: Request tracking and analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool provides AI-assisted, generalized policy insights. It is not financial advice. Always read the policy documents and consult a qualified insurance professional for specific guidance.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

Built with ❤️ using Next.js 14 and modern web technologies.
