FROM node:20-alpine as BUILD_IMAGE

COPY . /app
WORKDIR /app
# Display contents of the /app directory
RUN ls -al

RUN npm ci

RUN npm run build

# Production

FROM node:20-alpine

COPY --from=BUILD_IMAGE /app/next.config.mjs ./app/next.config.mjs
COPY --from=BUILD_IMAGE /app/public ./app/public
COPY --from=BUILD_IMAGE /app/.next ./app/.next
COPY --from=BUILD_IMAGE /app/package.json ./app/package.json
COPY --from=BUILD_IMAGE /app/.env.production ./app/.env.production

COPY --from=BUILD_IMAGE /app/package-lock.json ./app/package-lock.json

WORKDIR /app

ENV NODE_ENV=production
RUN npm ci --omit=dev --ignore-scripts

RUN npx next telemetry disable
CMD ["npm", "start"]