# Use the official Node.js image as the base image
FROM oven/bun:latest

# Install git
RUN apt update && apt install -y git

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN bun install

# Copy the postgraphile script files to the working directory
COPY postgraphile ./

# Expose the port that PostGraphile will listen on
EXPOSE 5000

# Start PostGraphile when the container starts
CMD bun ./postgraphile/main.js
