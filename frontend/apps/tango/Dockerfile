FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts ./
RUN npm install
COPY src/ src/
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist dist/
EXPOSE 5006
CMD ["serve", "-s", "dist", "-l", "5006"]
