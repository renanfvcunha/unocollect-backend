FROM node:16-alpine

WORKDIR /home/node/app

RUN chown -Rh node:node /home/node

USER node

COPY . ./