FROM node:18

WORKDIR /workspace

RUN npm install -g expo-cli

COPY package.json yarn.lock* /workspace/
RUN yarn install

COPY . /workspace

EXPOSE 19000 19001 19002

CMD ["/bin/sh", "-c", "yarn start --tunnel"]