# Build the backend image
FROM node:lts-alpine as backend
WORKDIR /app
COPY ./backend/package*.json .
RUN npm install
COPY ./backend .

# Build the backend
RUN npm run build

# Build the frontend image
FROM node:lts-alpine as frontend
WORKDIR /app
COPY ./frontend/package*.json .
RUN npm install
COPY ./frontend .
COPY .env ..

# Build the frontend
RUN npm run build

# Build the final image
FROM node:lts-alpine
WORKDIR /app
COPY --from=backend /app .
COPY --from=frontend /app/dist ./public

# Run the app
CMD if [ "$DOCKER_SEED" = "true" ]; then npm run seed & node dist/index.js; else node dist/index.js; fi