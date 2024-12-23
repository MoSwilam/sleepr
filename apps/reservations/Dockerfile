FROM node:alpine as development

WORKDIR /usr/src/app

# Install OpenSSL
RUN apk add --no-cache openssl

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/reservations/prisma ./prisma

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm prisma generate

COPY apps/reservations apps/reservations
COPY libs libs

RUN pnpm run build reservations




FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install -g pnpm

RUN pnpm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["pnpm", "run", "start:prod", "dist/apps/reservations/main"]