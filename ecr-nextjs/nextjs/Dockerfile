# stage1: starting build files
FROM node:lts-alpine AS builder

WORKDIR /opt/app
COPY . .

# install npm library for all (dev and production)
RUN npm install

# disable telemetry from next.js
RUN npx next telemetry disable

RUN npm run build

# stage2: generate production image
FROM node:lts-alpine AS runner

# ARG X_TAG
WORKDIR /opt/app
ENV NODE_ENV=production

# install npm libraries only for production
COPY package.json .
COPY package-lock.json .
RUN npm install

# copy file if custom next config file exits
COPY --from=builder /opt/app/next.config.js ./
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next

EXPOSE 3000

CMD [ "npm", "start" ]