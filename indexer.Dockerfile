FROM node:lts-alpine

# Set the SLEEP_INTERVAL_SECONDS argument with a default value of 0
ARG SLEEP_INTERVAL_SECONDS=0

# Install git
RUN apk add git

# Set the working directory to /app
WORKDIR /app

# Copy the package.json, yarn.lock, and tsconfig.json to the working directory
COPY package.json yarn.lock tsconfig.json ./

# Install TypeScript compiler globally
RUN npm install -g typescript

# Install package dependencies
RUN yarn install --production --frozen-lockfile

COPY lib lib
COPY indexer ./

# Set the command to run with the SLEEP_INTERVAL_SECONDS argument
CMD yarn build && node ./build/main.js && sleep ${SLEEP_INTERVAL_SECONDS}
