FROM node:16
RUN mkdir -p /workdir/app/src/generated
WORKDIR      /workdir/server

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD [ "yarn", "build-start" ]