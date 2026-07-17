FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm ci --omit=dev
COPY --from=builder /app/dist dist/
COPY --from=builder /app/node_modules node_modules/
EXPOSE 5014
CMD ["node", "dist/index.js"]
