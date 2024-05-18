FROM node:current-alpine3.19
VOLUME [ "/rocketbank-dev" ]
COPY package.json package.json
COPY jsconfig.json jsconfig.json
COPY vite.config.js vite.config.js
COPY vue.config.js vue.config.js
COPY pnpm-lock.yaml pnpm-lock.yaml
COPY yarn.lock yarn.lock
COPY index.js index.js
COPY var.env .env
RUN apk update
RUN apk add yarn
RUN yarn install
EXPOSE 3000
ENTRYPOINT [ "yarn", "start" ]