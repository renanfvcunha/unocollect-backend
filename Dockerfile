FROM node:16-alpine

USER node

WORKDIR /home/node

COPY package*.json ./

RUN npm ci

COPY . ./
