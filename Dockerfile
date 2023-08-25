FROM node:20-alpine

RUN addgroup -S adroidea && adduser -S adan -G adroidea

RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

RUN mkdir -p /usr/src/adroid
WORKDIR /usr/src/adroid

COPY package.json /usr/src/adroid
RUN npm install --omit=dev --ignore-scripts

COPY dist /usr/src/adroid

USER adan
CMD ["node", "index.js"]
