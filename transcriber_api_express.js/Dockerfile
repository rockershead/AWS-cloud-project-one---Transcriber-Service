FROM mhart/alpine-node:16
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run prebuild
CMD npm start
EXPOSE 8087