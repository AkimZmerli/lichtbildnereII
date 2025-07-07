# Development Setup Guide

A comprehensive guide for setting up the portfolio project development environment, including troubleshooting, advanced configuration, and best practices.

## Quick Start

For experienced developers who want to get running immediately:

```bash
# Clone and install
git clone <repository-url>
cd portfolio-project
pnpm install

# Setup environment
cp env.example .env
# Edit .env with your database credentials

# Start database (Docker)
docker run --name portfolio-postgres -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Start development server
pnpm dev
```

Access at: [http://localhost:3000](http://localhost:3000) (Frontend) | [http://localhost:3000/admin](http://localhost:3000/admin) (CMS)

---

## Prerequisites

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|--------------|
| **Node.js** | ≥18.20.2 or ≥20.9.0 | Runtime environment | [nodejs.org](https://nodejs.org) |
| **pnpm** | v9 or v10 | Package manager | `npm install -g pnpm` |
| **PostgreSQL** | ≥13 | Database | [postgresql.org](https://postgresql.org) or Docker |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com) |

### Optional Tools

- **Docker** - For containerized database setup
- **VS Code** - Recommended editor with project-specific settings
- **Postman/Insomnia** - For API testing

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended for smooth development)
- **Storage**: 2GB free space for dependencies and media
- **OS**: macOS, Linux, or Windows with WSL2

---

## Installation Methods

### Method 1: Standard Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd portfolio-project
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Verify installation**:
   ```bash
   pnpm --version  # Should show v9 or v10
   node --version  # Should show v18.20.2+
   ```

### Method 2: Development Container (VS Code)

If you prefer a containerized development environment:

1. Install VS Code with Dev Containers extension
2. Open project in VS Code
3. Command Palette → "Dev Containers: Reopen in Container"
4. Container will automatically install all dependencies

---

## Database Setup

### Option 1: Docker (Recommended)

**Quick Setup:**
```bash
# Start PostgreSQL container
docker run --name portfolio-postgres \
  -e POSTGRES_DB=portfolio \
  -e POSTGRES_USER=portfolio \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verify connection
docker exec -it portfolio-postgres psql -U portfolio -d portfolio -c "SELECT version();"
```

**Using Docker Compose:**
Create `docker-compose.yml` in project root:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Start with: `docker-compose up -d`

### Option 2: Local PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb portfolio
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createdb portfolio
sudo -u postgres createuser --interactive
```

**Windows:**
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

---

## Environment Configuration

### 1. Create Environment File

```bash
cp env.example .env
```

### 2. Required Environment Variables

Edit `.env` with your specific values:

```bash
# PayloadCMS Configuration
PAYLOAD_SECRET=your-secret-key-here  # Generate with: openssl rand -base64 32

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=portfolio
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=password

# Application URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Optional: Media Storage (for production)
# AWS_ACCESS_KEY_ID=your-aws-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret
# AWS_REGION=us-east-1
# AWS_BUCKET=your-bucket-name
```

### 3. Generate Secure Secrets

```bash
# Generate PAYLOAD_SECRET
openssl rand -base64 32

# Alternative for Windows/systems without openssl
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Environment Validation

Verify your configuration:
```bash
# Test database connection
pnpm payload db:status

# Validate environment variables
node -e "
const config = require('./src/payload.config.ts');
console.log('✅ Configuration loaded successfully');
"
```

---

## Development Workflow

### 1. Start Development Server

```bash
# Start in development mode
pnpm dev

# Start with specific port
PORT=3001 pnpm dev

# Start with debug logging
DEBUG=payload:* pnpm dev
```

### 2. Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main portfolio website |
| **CMS Admin** | http://localhost:3000/admin | Content management |
| **GraphQL Playground** | http://localhost:3000/api/graphql-playground | API testing |
| **REST API** | http://localhost:3000/api | REST endpoints |

### 3. Initial Admin Setup

1. Navigate to http://localhost:3000/admin
2. Create your first admin user
3. Upload sample media files
4. Create test gallery items

---

## Available Scripts

### Development Scripts

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Fix linting issues automatically
pnpm lint --fix
```

### PayloadCMS Scripts

```bash
# Generate TypeScript types from collections
pnpm generate:types

# Access PayloadCMS CLI
pnpm payload

# Database operations
pnpm payload db:migrate
pnpm payload db:seed
pnpm payload db:status

# Create admin user
pnpm payload create-admin
```

### Utility Scripts

```bash
# Clean node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml && pnpm install

# Check for outdated dependencies
pnpm outdated

# Update dependencies
pnpm update
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 pnpm dev
```

#### 2. Database Connection Failed

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
```bash
# Check if PostgreSQL is running
docker ps  # For Docker setup
brew services list | grep postgresql  # For Homebrew

# Restart database
docker restart portfolio-postgres  # Docker
brew services restart postgresql@15  # Homebrew

# Check connection manually
psql -h localhost -p 5432 -U portfolio -d portfolio
```

#### 3. TypeScript Errors

**Error:** `Cannot find module` or type errors

**Solutions:**
```bash
# Regenerate types
pnpm generate:types

# Clear TypeScript cache
rm -rf .next
pnpm dev

# Check TypeScript configuration
npx tsc --noEmit
```

#### 4. Module Resolution Issues

**Error:** `Module not found` or import errors

**Solutions:**
```bash
# Clear all caches
rm -rf .next node_modules pnpm-lock.yaml
pnpm install

# Check for conflicting dependencies
pnpm ls --depth=0
```

#### 5. PayloadCMS Admin Not Loading

**Error:** Admin interface shows errors or won't load

**Solutions:**
```bash
# Check environment variables
echo $PAYLOAD_SECRET

# Verify database schema
pnpm payload db:migrate

# Clear browser cache and cookies
# Try incognito/private browsing mode
```

### Performance Issues

#### Slow Development Server

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm dev

# Disable source maps for faster builds
GENERATE_SOURCEMAP=false pnpm dev

# Use SWC instead of Babel (already configured)
```

#### Large Bundle Size

```bash
# Analyze bundle
pnpm build
npx @next/bundle-analyzer

# Check for duplicate dependencies
pnpm ls --depth=0 | grep -E "(react|lodash)"
```

### Debug Mode

Enable detailed logging:

```bash
# PayloadCMS debug
DEBUG=payload:* pnpm dev

# Next.js debug
DEBUG=next:* pnpm dev

# Database queries
DEBUG=payload:db:* pnpm dev
```

---

## Advanced Configuration

### Custom Domain Setup

For local development with custom domain:

1. **Edit hosts file:**
   ```bash
   # Add to /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
   127.0.0.1 portfolio.local
   ```

2. **Update environment:**
   ```bash
   NEXT_PUBLIC_SERVER_URL=http://portfolio.local:3000
   ```

### SSL/HTTPS Setup

For HTTPS in development:

1. **Generate certificates:**
   ```bash
   # Using mkcert
   brew install mkcert  # macOS
   mkcert -install
   mkcert localhost 127.0.0.1 ::1
   ```

2. **Configure Next.js:**
   ```javascript
   // next.config.mjs
   const nextConfig = {
     experimental: {
       https: {
         key: './localhost-key.pem',
         cert: './localhost.pem',
       },
     },
   };
   ```

### Environment-Specific Configurations

Create multiple environment files:

```bash
.env.local          # Local development (gitignored)
.env.development    # Development defaults
.env.staging        # Staging environment
.env.production     # Production environment
```

Load specific environment:
```bash
NODE_ENV=staging pnpm dev
```

---

## IDE Setup

### VS Code Configuration

The project includes VS Code settings in `.vscode/`:

- **Extensions**: Recommended extensions for optimal development
- **Settings**: Project-specific editor configuration
- **Launch**: Debug configurations for Next.js and PayloadCMS

**Recommended Extensions:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

### Other IDEs

**WebStorm:**
- Import project as Next.js application
- Enable TypeScript service
- Configure Prettier and ESLint

**Vim/Neovim:**
- Install TypeScript language server
- Configure Prettier and ESLint plugins

---

## Testing Setup

### Unit Testing (Future)

When implementing tests:

```bash
# Install testing dependencies
pnpm add -D jest @testing-library/react @testing-library/jest-dom

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### E2E Testing (Future)

For end-to-end testing:

```bash
# Install Playwright
pnpm add -D @playwright/test

# Run E2E tests
pnpm test:e2e
```

---

## Production Considerations

### Build Optimization

```bash
# Production build with analysis
ANALYZE=true pnpm build

# Check build output
pnpm build && pnpm start
```

### Environment Variables

Ensure production environment has:
- Secure `PAYLOAD_SECRET`
- Production database credentials
- Correct `NEXT_PUBLIC_SERVER_URL`
- Media storage configuration (AWS S3, etc.)

### Performance Monitoring

Consider adding:
- Sentry for error tracking
- Vercel Analytics for performance
- Custom logging for PayloadCMS operations

---

## Getting Help

### Documentation Resources

- **PayloadCMS Docs**: [payloadcms.com/docs](https://payloadcms.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Project Architecture**: See `ARCHITECTURE.md`
- **API Reference**: See `API.md`

### Community Support

- **PayloadCMS Discord**: [discord.gg/payloadcms](https://discord.gg/payloadcms)
- **Next.js Discussions**: [github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)

### Reporting Issues

When reporting issues, include:
- Operating system and version
- Node.js and pnpm versions
- Complete error messages
- Steps to reproduce
- Environment variables (without sensitive values)

---

**Last Updated**: July 7, 2025  
**Node.js Version**: 18.20.2+  
**PayloadCMS Version**: 3.33.0  
**Next.js Version**: 15.3.0
