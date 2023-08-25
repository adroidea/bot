FROM node:20-alpine

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

USER nonroot

ENV TZ="Europe/Paris"

RUN mkdir -p /usr/src/adroid
WORKDIR /usr/src/adroid

COPY package.json /usr/src/adroid
RUN npm install --omit=dev --ignore-scripts

COPY dist /usr/src/adroid
RUN ln -snf /usr/share/zoneinfo/Europe/Paris /etc/localtime && echo "Europe/Paris" > /etc/timezone

CMD ["node", "index.js"]
