FROM node:21-alpine

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install --global expo-cli && npm install

COPY . .

EXPOSE 19000 19001 19002

CMD ["npm", "start"]


