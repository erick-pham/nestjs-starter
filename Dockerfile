###################
# BUILD FOR PRODUCTION
###################

FROM node:18.15.0-alpine3.17 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY . .

RUN npm install
RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

COPY --chown=node:node . .

USER node


###################
# PRODUCTION
###################

FROM node:18.15.0-alpine3.17 As production

WORKDIR /app

ENV NODE_ENV production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
