FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund

COPY . .

EXPOSE 19000

ENV NODE_OPTIONS="--max-old-space-size=3072"
ENV EXPO_NO_SOURCE_MAPS=1

CMD ["npx", "expo", "start", "--web", "--port", "19000"]