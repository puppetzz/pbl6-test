FROM node:18.15.0-alpine
WORKDIR /app
ADD package*.json ./
RUN yarn install
ADD . .
CMD ["yarn", "start"]
