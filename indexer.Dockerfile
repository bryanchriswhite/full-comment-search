FROM node:lts-alpine

# Set the SLEEP_INTERVAL_SECONDS argument with a default value of 0
ARG SLEEP_INTERVAL_SECONDS=0

# Install git
RUN apk add git

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install package dependencies
RUN yarn install --production --frozen-lockfile

COPY lib lib
COPY indexer.ts .

# Set the command to run with the SLEEP_INTERVAL_SECONDS argument
CMD "yarn index && sleep ${SLEEP_INTERVAL_SECONDS}"
