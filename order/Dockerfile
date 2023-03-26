FROM node:18.12.0-alpine3.15

WORKDIR /order

COPY ./package.json .

RUN npm install

COPY . .

CMD ["npm","start"]

