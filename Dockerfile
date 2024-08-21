# === Development Stage ===
FROM node:16-alpine AS development
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false
COPY . .
RUN yarn build

# === Production Stage ===
FROM node:16-alpine AS production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false
COPY . .
RUN yarn build

# === Final Stage ===
FROM node:16-alpine
WORKDIR /app
COPY --from=development /app/dist ./dist
COPY --from=production /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["yarn", "run", "start:prod"]