# Deployment Guide

This document covers the complete deployment setup for the Rune application, including Docker configuration, CI/CD, and Render deployment.

## Architecture

- **Backend**: FastAPI Python application
- **Frontend**: React/Vite application served via nginx
- **Deployment**: Render (PaaS)
- **CI/CD**: Pre-commit hooks for code quality

## Docker Configuration

### Backend Dockerfile (`server/Dockerfile`)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Key Points**:
- Uses Python 3.11 slim image for minimal size
- Installs dependencies from `requirements.txt`
- Copies all application code
- Runs uvicorn directly on port 8000
- **Important**: Uses relative imports (`app.main:app`) not absolute (`server.app.main:app`)

### Frontend Dockerfile (`client/Dockerfile`)

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Create .env with production URL for build
RUN echo "VITE_API_BASE_URL=https://rune-backend-b5n5.onrender.com" > .env

RUN npx vite build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Key Points**:
- Multi-stage build for smaller final image
- Build stage: Node 18 Alpine, installs dependencies, builds with Vite
- Production stage: nginx Alpine, serves static files
- **Critical**: Hardcodes production backend URL during build time
- Uses nginx configuration for proper static file serving

### Nginx Configuration (`client/nginx.conf`)

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Handles SPA routing by falling back to index.html for non-file routes.

## Render Configuration

### Blueprint (`render.yaml`)

```yaml
services:
  - type: web
    name: rune-backend
    env: docker
    plan: free
    dockerContext: ./server
    dockerfilePath: ./server/Dockerfile
    envVars:
      - key: GOOGLE_API_KEY
        sync: false  # Must be set manually in Render dashboard
      - key: ALLOWED_ORIGIN
        value: https://rune-frontend-b2j6.onrender.com

  - type: web
    name: rune-frontend
    env: docker
    plan: free
    dockerContext: ./client
    dockerfilePath: ./client/Dockerfile
```

**Key Points**:
- Backend uses Docker with server context
- Frontend uses Docker with client context
- `GOOGLE_API_KEY` has `sync: false` - must be set manually in Render dashboard for security
- `ALLOWED_ORIGIN` is set to the actual frontend URL (with random suffix)
- Frontend doesn't need envVars in render.yaml since URL is hardcoded in Dockerfile

## CI/CD Configuration

### Pre-commit Hooks (`.pre-commit-config.yaml`)

```yaml
repos:
  - repo: local
    hooks:
      - id: guard-secrets
        name: Block secrets and misplaced API keys
        entry: python scripts/guard_secrets.py
        language: python
        pass_filenames: false

      - id: block-direct-api-calls
        name: Block client-side calls to api.anthropic.com
        entry: python scripts/block_direct_api_calls.py
        language: python
        pass_filenames: false

      - id: schema-sync
        name: Check plan.ts and plan.py stay in sync
        entry: python scripts/check_schema_sync.py
```

**Security Hooks**:
- Blocks API keys from being committed
- Prevents direct API calls from client-side code
- Ensures TypeScript and Python schemas stay in sync

## Issues Fixed During Deployment

### 1. Import Path Issues

**Problem**: `ModuleNotFoundError: No module named 'server'`

**Cause**: Code used absolute imports like `from server.app.routers import generate` but Docker context was the `server` directory, so there was no `server` module.

**Solution**: Changed all imports to relative paths:
- `from server.app.routers import generate` → `from app.routers import generate`
- `from server.app.config import settings` → `from app.config import settings`

**Files Changed**:
- `server/app/main.py`
- `server/app/routers/generate.py`
- `server/app/routers/refine.py`
- `server/app/services/gemini_client.py`
- `server/app/services/generate_prompt.py`
- `server/app/services/parse_plan_response.py`
- `server/tests/*.py` (test files)

### 2. Invalid Render Configuration

**Problem**: `field dockerArgs not found in type file.Service`

**Cause**: Used `dockerArgs` which is not a valid field for Docker services on Render.

**Solution**: Replaced with `envVars`:
```yaml
# Before (invalid)
dockerArgs:
  build:
    args:
      VITE_API_BASE_URL: https://rune-backend.onrender.com

# After (correct)
envVars:
  - key: VITE_API_BASE_URL
    value: https://rune-backend.onrender.com
```

### 3. Frontend Environment Variable Not Working

**Problem**: Frontend still pointed to `localhost:8000` even after render.yaml changes

**Cause**: Dockerfile copied `.env.example` which hardcoded `localhost:8000`, and Render envVars weren't being passed as build args.

**Solution**: Hardcoded production URL in Dockerfile during build:
```dockerfile
RUN echo "VITE_API_BASE_URL=https://rune-backend-b5n5.onrender.com" > .env
```

### 4. CORS Issues

**Problem**: `Access to fetch blocked by CORS policy`

**Cause**: Backend's `ALLOWED_ORIGIN` didn't match the actual frontend URL (Render adds random suffix like `-b2j6`).

**Solution**: 
1. Updated `render.yaml` with correct frontend URL
2. Added hardcoded fallback in `main.py`
3. Finally set `allow_origins=["*"]` for development

**Note**: For production, should use specific origins, not wildcard.

### 5. Backend URL Mismatch

**Problem**: Frontend pointed to `https://rune-backend.onrender.com` but actual URL was `https://rune-backend-b5n5.onrender.com`

**Cause**: Render services get random suffixes in their URLs.

**Solution**: Updated Dockerfile with correct backend URL including the suffix.

## Deployment Steps

### Initial Setup

1. **Set up Render account** and connect GitHub repository
2. **Add environment variables** in Render dashboard for backend:
   - `GOOGLE_API_KEY`: Your actual Gemini API key
   - `ALLOWED_ORIGIN`: Your frontend URL (e.g., `https://rune-frontend-b2j6.onrender.com`)

### Deploying to Render

1. **Push changes to GitHub**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Render will auto-deploy** from the `render.yaml` blueprint

3. **Manual deploy** (if needed):
   - Go to Render dashboard
   - Select service
   - Click "Manual Deploy" → "Deploy latest commit"

### Local Development

**Backend**:
```bash
cd server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend**:
```bash
cd client
npm install
npm run dev
```

**Docker Compose** (local):
```bash
docker-compose up
```

## Security Considerations

1. **API Keys**: Never commit API keys to version control
   - Use `sync: false` in render.yaml for secrets
   - Set actual values in Render dashboard
   - Use `.env` files locally (gitignored)

2. **CORS**: Use specific origins in production, not wildcards
   - Currently using `allow_origins=["*"]` for development
   - Should be restricted to specific frontend URL in production

3. **Pre-commit hooks**: Prevent secrets from being committed
   - `guard-secrets` blocks API keys
   - `block-direct-api-calls` prevents client-side API calls

## URLs

- **Backend**: `https://rune-backend-b5n5.onrender.com`
- **Frontend**: `https://rune-frontend-b2j6.onrender.com`
- **Health Check**: `https://rune-backend-b5n5.onrender.com/health`
- **API Endpoints**: 
  - `POST /api/generate`
  - `POST /api/refine`

## Troubleshooting

### Backend fails to start
- Check Render logs for errors
- Verify `GOOGLE_API_KEY` is set in dashboard
- Ensure imports use relative paths (`app.*` not `server.app.*`)

### Frontend can't connect to backend
- Verify backend URL in Dockerfile matches actual Render URL
- Check CORS configuration in `main.py`
- Ensure backend is running and accessible

### CORS errors
- Check `ALLOWED_ORIGIN` matches frontend URL exactly
- Verify middleware is loaded in `main.py`
- Check backend logs for startup errors

### Build failures
- Check Dockerfile syntax
- Verify all dependencies are in `requirements.txt` or `package.json`
- Check for syntax errors in application code
