#!/bin/sh

npm run build

npm run typeorm:migrate

npm run start:prod