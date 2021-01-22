FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY ./ ./
CMD ["node", "backend.js"]

EXPOSE 6000