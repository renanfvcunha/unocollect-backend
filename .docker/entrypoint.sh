#!/bin/sh

npm i

npm run typeorm:migrate

npm run build

npm run start:prod