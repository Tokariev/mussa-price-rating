FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

# rimraf is an executable that is used to clean the installed node packages in a node based project.
# It basically executes the rm -rf command on the node_modules directory, but is a faster alternative.

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

EXPOSE 3000

RUN npm run build


########################
# Production container #
########################

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/dist ./dist

COPY package*.json ./

RUN npm install --only=production

COPY . .

CMD ["node", "dist/main"]
