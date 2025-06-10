FROM node:22-bullseye-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
# install full dependencies (including dev) for build
RUN npm ci

COPY . .
RUN npm run build:ignore

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
