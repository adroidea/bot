FROM node:20-alpine

RUN addgroup -S adroidea && adduser -S adan -G adroidea

RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

RUN mkdir -p /usr/adroid/src
WORKDIR /usr/adroid/src

COPY package.json /usr/adroid/src
RUN npm install --omit=dev --ignore-scripts

COPY dist /usr/adroid/src

USER adan
CMD ["node", "index.js"]
