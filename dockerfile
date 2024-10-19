FROM node:21-alpine3.19

WORKDIR /usr/src/app 

COPY package*.json ./
COPY package-lock.json ./ /usr/src/app/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main"]