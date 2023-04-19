FROM oven/bun:latest

# Set the SLEEP_INTERVAL_SECONDS argument with a default value of 0
ARG SLEEP_INTERVAL_SECONDS=0

# Install git
RUN apt update && apt install -y git

# Set the working directory to /app
WORKDIR /app

# Copy the package.json, yarn.lock, and tsconfig.json to the working directory
COPY package.json yarn.lock tsconfig.json ./

# Install package dependencies
RUN bun install

COPY lib lib
COPY indexer ./

# Set the command to run with the SLEEP_INTERVAL_SECONDS argument
CMD bun ./indexer/main.ts && echo "sleeping for ${}" && sleep ${SLEEP_INTERVAL_SECONDS}
