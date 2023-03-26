FROM node:18.12.0-alpine

WORKDIR /usr/client

COPY package.json .

RUN npm install

COPY . .

CMD [ "npm","start" ]
