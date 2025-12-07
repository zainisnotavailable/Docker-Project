# Docker Deployment Project Report

**Student Name:** [Your Name]  
**Date:** December 6, 2025  
**Course:** [Your Course Name]

---

## Part 1: Understanding Environment Inconsistency

### Step 1: Installing Node.js 16

First, we need to uninstall any existing Node.js versions and install Node.js 16 to simulate a production server environment.

#### Commands Executed:

```bash
# Remove existing Node.js installations
sudo apt remove -y nodejs npm
sudo apt autoremove -y

# Update package index
sudo apt update

# Install required dependencies
sudo apt install -y curl

# Add Node.js 16.x from NodeSource
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs
```

### Step 2: Verify Node.js 16 Installation

```bash
node -v
npm -v
```

**📸 SCREENSHOT 1: Node.js Version Verification**
![alt text](image.png)

---


### Step 3: Clone and Run the Node.js Application

Now we will clone the repository from GitHub and attempt to run it on our Node.js 16 server environment.

#### Commands Executed:

```bash
# Create a working directory
mkdir -p ~/docker-assignment
cd ~/docker-assignment

# Clone the repository
git clone https://github.com/LaibaImran1500/SCD-25-NodeApp.git

# Navigate to the project directory
cd SCD-25-NodeApp

# View project structure
ls -la

# Check package.json for dependencies and node version requirements
cat package.json


# Install dependencies
npm install

# Run the application
npm start
```

**📸 SCREENSHOT 2: Cloning the Repository**
![alt text](image-1.png)

**📸 SCREENSHOT 3: Package.json Contents**
![alt text](image-2.png)





#### Step 3.1: Install Dependencies

```bash
npm install
```

**npm install Output - Version Warnings:**
```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'body-parser@2.2.1',
npm WARN EBADENGINE   required: { node: '>=18' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'express@5.2.1',
npm WARN EBADENGINE   required: { node: '>= 18' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'finalhandler@2.1.1',
npm WARN EBADENGINE   required: { node: '>= 18.0.0' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'router@2.2.0',
npm WARN EBADENGINE   required: { node: '>= 18' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'send@1.2.0',
npm WARN EBADENGINE   required: { node: '>= 18' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'serve-static@2.2.0',
npm WARN EBADENGINE   required: { node: '>= 18' },
npm WARN EBADENGINE   current: { node: 'v16.20.2', npm: '8.19.4' }
npm WARN EBADENGINE }
```

**📸 SCREENSHOT 4: npm install Warnings**
- Take a screenshot showing the npm install warnings about unsupported engine
- These warnings clearly show Node.js 18+ is required but we have Node.js 16

---

#### Step 3.2: Run the Application

```bash
node app.js
```

**Server Output:**
```
Server is running on http://localhost:3000
```

The server starts, but when we test the endpoint...

---

#### Step 3.3: Test the Backend Endpoint

```bash
curl http://localhost:3000/todo/1
```

**Response:**
```json
{"error":"Internal Server Error"}
```

**Server Console Error:**
```
Fetch error: ReferenceError: fetch is not defined
    at /home/ZainAliKhan/Desktop/SCD Project/SCD-25-NodeApp/app.js:8:26
    at Layer.handleRequest (/home/ZainAliKhan/Desktop/SCD Project/SCD-25-NodeApp/node_modules/router/lib/layer.js:152:17)
    at next (/home/ZainAliKhan/Desktop/SCD Project/SCD-25-NodeApp/node_modules/router/lib/route.js:157:13)
    at Route.dispatch (/home/ZainAliKhan/Desktop/SCD Project/SCD-25-NodeApp/node_modules/router/lib/route.js:117:3)
```

**📸 SCREENSHOT 5: Application Runtime Error**
- Take a screenshot showing:
  1. The server starting (`Server is running on http://localhost:3000`)
  2. The curl command and response (`{"error":"Internal Server Error"}`)
  3. The error in server console: `ReferenceError: fetch is not defined`
  ![alt text](image-3.png)

---

### Environment Mismatch Analysis

#### Issues Encountered:

1. **npm install Warnings - Unsupported Engine:**
   - Multiple packages require Node.js 18+
   - Express 5.2.1 requires `node >= 18`
   - body-parser, router, send, serve-static all require Node.js 18+
   - Our server has Node.js v16.20.2

2. **Runtime Error - fetch is not defined:**
   - The application uses native `fetch()` API in app.js line 8
   - Native `fetch()` was introduced in Node.js 18 (experimental) and stable in Node.js 21
   - Node.js 16 does NOT have native `fetch()` support
   - **Error: `ReferenceError: fetch is not defined`**

3. **Version Mismatch Summary:**

   | Component | Required Version | Server Version | Status |
   |-----------|-----------------|----------------|--------|
   | Node.js | >= 18 | v16.20.2 | ❌ Incompatible |
   | Express | 5.2.1 | - | ❌ Requires Node 18+ |
   | fetch() API | Node 18+ | Not available | ❌ Not supported |
   | body-parser | 2.2.1 | - | ❌ Requires Node 18+ |
   | router | 2.2.0 | - | ❌ Requires Node 18+ |

#### How Environment Mismatch Prevents Proper Deployment:

1. **Development vs Production Environment Gap:**
   - The developer built this application using Node.js 18+ where `fetch()` is natively available
   - The production server runs Node.js 16 which lacks this feature
   - The application compiles but fails at runtime when the fetch() function is called

2. **No Explicit Version Requirements in package.json:**
   - The package.json does not specify an "engines" field
   - This makes it difficult to identify compatibility issues before deployment
   - npm only shows warnings, not errors, allowing installation to proceed

3. **Modern JavaScript Features Not Backward Compatible:**
   - The code uses modern features (native fetch) that don't exist in older Node versions
   - Without containerization, we cannot run different Node.js versions for different applications on the same server

4. **Server Environment Constraints:**
   - We cannot upgrade Node.js on the server as other applications depend on Node.js 16
   - We cannot modify the source code as that is the developer's responsibility

#### Conclusion:

As a production engineer, we CANNOT:
- Modify the source code (developer's responsibility)
- Upgrade Node.js on the server (would break other applications)

The application fails to run properly due to Node.js version incompatibility. We need a solution that allows running this application with its required Node.js version (18+) without affecting other applications on the server that depend on Node.js 16.

**Solution: Docker Containerization** - This will be addressed in Part 2.

---


## Part 2: Solving with Docker Containers

### Identifying the Right Node.js Version

#### Analysis:

Based on the errors encountered in Part 1, we need to identify the correct Node.js version:

1. **Express 5.x Requirements:**
   - Express 5.2.1 requires `node >= 18`
   - Reference: https://expressjs.com/en/guide/migrating-5.html

2. **Native fetch() API Requirements:**
   - The `fetch()` API was added as experimental in Node.js 18
   - It became stable in Node.js 21
   - Reference: https://nodejs.org/docs/latest-v18.x/api/globals.html#fetch

3. **Package Dependencies:**
   - body-parser@2.2.1 requires `node >= 18`
   - router@2.2.0 requires `node >= 18`
   - All other dependencies also require Node.js 18+

#### Justification for Node.js 18:

| Reason | Explanation |
|--------|-------------|
| Express 5.x Support | Express 5.2.1 officially requires Node.js 18+ |
| Native fetch() | fetch() API is available natively in Node.js 18+ |
| LTS Version | Node.js 18 is an LTS (Long Term Support) version, ensuring stability |
| Dependency Compatibility | All npm packages in this project require Node.js 18+ |

**Selected Version: Node.js 18 (LTS - Alpine)**

**References:**
- Express 5.x Migration Guide: https://expressjs.com/en/guide/migrating-5.html
- Node.js 18 Release Notes: https://nodejs.org/en/blog/release/v18.0.0
- Node.js fetch() Documentation: https://nodejs.org/docs/latest-v18.x/api/globals.html#fetch

---

### Dockerfile

The following Dockerfile containerizes the Node.js application with the correct Node.js version:

```dockerfile
# Use Node.js 18 Alpine as base image (LTS version with native fetch support)
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
```

---

### Step 1: Create the Dockerfile

```bash
cd ~/docker-assignment/SCD-25-NodeApp

# Create Dockerfile
cat > Dockerfile << 'EOF'
# Use Node.js 18 Alpine as base image (LTS version with native fetch support)
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
EOF
```


---

### Step 2: Build the Docker Image

```bash
# Build the Docker image
docker build -t scd-nodeapp:v1 .
```

**📸 SCREENSHOT 7: Docker Build Process**
![alt text](image-4.png)

---

### Step 3: Run the Docker Container Locally

```bash
# Run the container
docker run -d -p 3000:3000 --name scd-nodeapp-container scd-nodeapp:v1

# Check if container is running
docker ps
```

**📸 SCREENSHOT 8: Container Running**
![alt text](image-5.png)

---

### Step 4: Test the Application in Container

```bash
# Test the endpoint
curl http://localhost:3000/todo/1
```

**Expected Response:**
```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

**📸 SCREENSHOT 9: Successful API Response**
![alt text](image-6.png)

---

### Step 5: View Container Logs

```bash
# View container logs
docker logs scd-nodeapp-container
```

**📸 SCREENSHOT 10: Container Logs**
![alt text](image-7.png)

---

### Step 6: Publish Docker Image to Docker Hub

```bash
# Login to Docker Hub 
docker login

# Tag the image for Docker Hub

docker tag scd-nodeapp:v1 zainalik157/scd-nodeapp:v1

# Push the image to Docker Hub
docker push zainalik157/scd-nodeapp:v1
```

**📸 SCREENSHOT 11: Docker Push to Hub**
![alt text](image-8.png)

**Docker Hub URL:** `https://hub.docker.com/r/zainalik157/scd-nodeapp`
![alt text](image-9.png)

---

### Step 7: Run on Server Environment

```bash
# Stop and remove local container first
docker stop scd-nodeapp-container
docker rm scd-nodeapp-container

# Pull and run from Docker Hub (simulating server deployment)
docker pull zainalik157/scd-nodeapp:v1
![alt text](image-10.png)
docker run -d -p 3000:3000 --name scd-nodeapp-container zainalik157/scd-nodeapp:v1
![alt text](image-11.png)
```

**📸 SCREENSHOT 12: Container Running on Server**
![alt text](image-12.png)

---

### Step 8: Test Backend Service in Container

```bash
# Test the endpoint
![alt text](image-13.png)
```

**📸 SCREENSHOT 13: Final Testing**
![alt text](image-14.png)
![alt text](image-15.png)

---

### Summary - Part 2

| Task | Status |
|------|--------|
| Identified correct Node.js version (18) | ✅ |
| Created Dockerfile | ✅ |
| Built Docker image locally | ✅ |
| Tested container locally | ✅ |
| Published to Docker Hub | ✅ |
| Deployed on server | ✅ |
| Tested backend service | ✅ |

**Docker solves the environment inconsistency problem by:**
1. Packaging the application with its required Node.js version (18)
2. Isolating the application from the host system
3. Ensuring consistent behavior across development and production
4. Not affecting other applications on the server that require Node.js 16

---

