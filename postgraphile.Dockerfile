# Use the official Node.js image as the base image
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY ./package.json ./package.json

# Install dependencies
RUN yarn install

# Copy the postgraphile script files to the working directory
COPY postgraphile.js ./

# Expose the port that PostGraphile will listen on
EXPOSE 5000

# Start PostGraphile when the container starts
CMD ["node", "postgraphile.js"]
