# Use the official Node.js image as the base image
FROM node:lts-alpine

# Install git
RUN apk add git

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY ./package.json ./yarn.lock ./

# Install dependencies
RUN yarn install --production --frozen-lockfile

# Copy the postgraphile script files to the working directory
COPY postgraphile ./

# Expose the port that PostGraphile will listen on
EXPOSE 5000

# Start PostGraphile when the container starts
CMD node ./postgraphile/main.js
