FROM node:18.13

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install
RUN yarn global add @nestjs/cli

COPY . .

EXPOSE 8080

CMD ["yarn", "start:dev"]
