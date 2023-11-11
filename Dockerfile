FROM node:21-alpine3.17
WORKDIR /app

COPY package.json ./
RUN yarn

COPY tsconfig.json ./
COPY src ./src

CMD [ "npm", "run", "start:dev" ]

EXPOSE 3000