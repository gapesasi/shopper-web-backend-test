#Base
FROM node:20-alpine AS base
WORKDIR /app

#Build stage
FROM base AS builder
COPY package*.json ./
COPY tsconfig*.json ./
COPY prisma ./prisma/

RUN npm install

COPY ./src ./src
COPY .env .env

RUN npm run build

#Production stage
FROM builder AS production

#Copies the compiled code into the dist folder in the production env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

#Executes the command to run the compiled app
ENTRYPOINT ["./prisma/wait-db.sh"]