FROM node:20-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --no-fund

COPY . .

EXPOSE 19000 19001 19002

CMD ["npm", "start"]


