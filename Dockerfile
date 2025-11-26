# Development stage
FROM node:20-alpine AS dev

WORKDIR /app

# Install git (required by some npm packages)
RUN apk add --no-cache git

# Copy package files
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Expose development port
EXPOSE 4321

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
