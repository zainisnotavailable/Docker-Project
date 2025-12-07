# NodeVault - CLI CRUD Application with MongoDB

A Node.js CLI-based CRUD application with MongoDB database, featuring search, sort, export, backup, and statistics functionality.

## Features

- ✅ Add, List, Update, Delete Records
- 🔍 Search Records (case-insensitive)
- 📊 Sort Records (by Name or Date)
- 📁 Export Data to Text File
- 💾 Automatic Backup System
- 📈 View Vault Statistics
- 🍃 MongoDB Database Integration
- 🐳 Docker Containerization

## Prerequisites

- Node.js 18+
- MongoDB (local or Docker)
- Docker & Docker Compose (for containerized deployment)

## Quick Start

### Option 1: Run Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run the application
npm start
```

### Option 2: Run with Docker Compose

```bash
# Build and start all services
docker compose up --build

# Or run in detached mode
docker compose up -d --build

# Attach to the backend container
docker attach nodevault-backend
```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://mongodb:27017/nodevault
NODE_ENV=production
```

## Docker Commands

```bash
# Build image
docker build -t nodevault:latest .

# Run with Docker Compose
docker compose up --build

# Stop services
docker compose down

# View logs
docker compose logs -f
```

## Project Structure

```
SCDProject25/
├── main.js              # Main application
├── package.json         # Dependencies
├── Dockerfile           # Docker image configuration
├── docker-compose.yml   # Docker Compose configuration
├── .env                 # Environment variables
├── .env.example         # Example environment file
├── .gitignore           # Git ignore rules
├── .dockerignore        # Docker ignore rules
├── backups/             # Automatic backups
├── db/
│   ├── index.js         # Database operations
│   ├── mongoose.js      # MongoDB connection
│   └── models/
│       └── Record.js    # Mongoose model
└── events/
    ├── index.js         # Event emitter
    └── logger.js        # Event logging
```

## Menu Options

```
===== NodeVault (MongoDB) =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Search Records
6. Sort Records
7. Export Data
8. View Vault Statistics
9. Exit
===============================
```

## License

ISC
