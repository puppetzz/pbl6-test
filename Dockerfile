FROM node:18.15.0-alpine
WORKDIR /app
ADD package*.json ./
RUN yarn install
ADD . .
CMD ["sh", "-c", "yarn build && yarn start"]

