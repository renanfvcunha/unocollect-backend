#!/bin/sh

npm ci

npm run build

npm run typeorm:migrate

npm run start:prod