FROM node:14.17.5

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install --save-dev @types/lodash@latest

COPY . .
COPY .env .

RUN npm run build

EXPOSE 5003

CMD [ "npm", "start" ]