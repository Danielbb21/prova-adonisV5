FROM node:alpine


WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "dev"]
