FROM node:lts-alpine

WORKDIR /app

COPY ./package.json /app/package.json

# TODO: copy app source

RUN yarn install

CMD yarn start