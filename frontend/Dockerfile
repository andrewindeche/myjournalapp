FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund

COPY . .

EXPOSE 19000

CMD ["npx", "expo", "start", "--web", "--port", "19000"]