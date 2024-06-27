FROM node:20-alpine

RUN addgroup -S adroidea && adduser -S adan -G adroidea

RUN apk add --no-cache tzdata
ENV TZ=Europe/Paris

# Install pnpm
RUN npm install -g pnpm --ignore-scripts

RUN mkdir -p /usr/adroid/src
WORKDIR /usr/adroid/src

COPY package.json /usr/adroid/src
COPY pnpm-lock.yaml /usr/adroid/src
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY dist /usr/adroid/src

USER adan
CMD ["node", "index.js"]