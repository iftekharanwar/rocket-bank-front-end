FROM node:current-alpine3.19

WORKDIR /app

COPY public/ public/
COPY jsconfig.json .
COPY package.json .
COPY pnpm-lock.yaml .
COPY vite.config.js .
COPY vue.config.js .
COPY proxyurl.env .env
COPY index.html .
COPY src/ src/

RUN apk update && npm install -g pnpm

RUN pnpm install

EXPOSE 5173

ENTRYPOINT ["pnpm", "dev", "--host", "0.0.0.0"]