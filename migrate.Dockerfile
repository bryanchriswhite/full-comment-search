# Use the official Node.js image as the base image
FROM node:lts-alpine

# Install `graphile-migrate`
RUN npm install -g graphile-migrate

# Copy config and migration files
COPY ./.gmrc /app/.gmrc
COPY ./migrations /app/migrations

WORKDIR /app

ENTRYPOINT ["graphile-migrate"]