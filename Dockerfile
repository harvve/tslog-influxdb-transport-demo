FROM node:18
WORKDIR /usr/src/app
COPY --chown=node:node . /usr/src/app
RUN npm ci
RUN npm run build
USER node
CMD [ "node", "dist/index.js" ]
