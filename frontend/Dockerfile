FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
