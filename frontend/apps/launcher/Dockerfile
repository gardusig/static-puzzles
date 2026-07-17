FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts tailwind.config.ts postcss.config.js index.html ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm ci --omit=dev
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
COPY --from=builder /app/package.json ./
EXPOSE 8091
CMD ["npx", "vite", "preview", "--port", "8091", "--host"]
