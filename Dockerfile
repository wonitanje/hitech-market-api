FROM node:lts-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

RUN yarn build

EXPOSE ${PORT}

CMD ["yarn", "start"]
