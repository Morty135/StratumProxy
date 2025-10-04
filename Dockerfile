FROM node:22

WORKDIR /usr/src/proxy

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]