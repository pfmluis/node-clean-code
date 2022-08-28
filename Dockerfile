FROM node:12

WORKDIR /usr/src/node-clean-code

COPY ./package.json .
RUN npm i --only=prod

COPY ./dist ./dist

EXPOSE 3000

CMD npm run start