FROM node:16.14.0-alpine

RUN mkdir -p /usr/src/bot && apk update && apk add git
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install --omit=dev

COPY dist /usr/src/bot
COPY .env /usr/src/bot/.env
RUN ln -snf /usr/share/zoneinfo/Europe/Paris /etc/localtime && echo Europe/Paris > /etc/timezone

CMD ["node", "index.js"]
