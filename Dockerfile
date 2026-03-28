FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage Docker cache.
COPY package*.json ./
RUN npm ci

# Copy source files.
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
