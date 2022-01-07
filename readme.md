# Hitech Market API
## Run via docker-compose
```bash
docker-compose up --build
```

## Run localy
* You can't run localy without minimal docker-compose bundle
* You must have node installed on your machine

Run `docker-compose up mongodb -d` to create database container \
Run `yarn` or `npm install` to install dependencies \
Run `yarn dev` or `npm run dev` to collect develop webpack bundle \
Run `yarn start` or `npm start` to start server node.js app
```bash
docker-compose up mongodb -d
yarn dev
yarn start
```