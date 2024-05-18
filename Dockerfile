FROM node:current-alpine3.19
COPY public/** /app/public/
COPY jsconfig.json /app/jsconfig.json
COPY package.json /app/package.json
COPY pnpm-lock.yaml /app/pnpm-lock.yaml
COPY vite.config.js /app/vie.config.js
COPY vue.config.js /app/vue.config.js
COPY proxyurl.env /app/.env
COPY src/** /app/src/
RUN apk update
RUN npm install -g pnpm
RUN cd /app && pnpm install
EXPOSE 3000
ENTRYPOINT [ "cd","/app","&&", "pnpm", "dev" ]