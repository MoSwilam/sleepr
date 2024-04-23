FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install pnpm -g

CMD ["pnpm", "test"]