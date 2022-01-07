# Hitech Market API
## Run via docker-compose
* Install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/#install-compose) on machine
```bash
docker-compose up --build -d
```

## Run locally
* You can't run localy without minimal [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/#install-compose) bundle
* You must have [node](https://nodejs.org/en/download/) installed on your machine

Run `docker-compose up mongodb -d` to create database container \
Run `yarn` or `npm install` to install dependencies \
Run `yarn dev` or `npm run dev` to collect develop webpack bundle \
Run `yarn start` or `npm start` to start server node.js app
```bash
docker-compose up mongodb -d
yarn dev
yarn start
```
