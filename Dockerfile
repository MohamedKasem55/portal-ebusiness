FROM node:boron

RUN npm install -g bower grunt-cli angular-cli



ENV HOME=/usr/src
ENV APP_NAME=app

# before switching to user we need to set permission properly
COPY package.json $HOME/$APP_NAME/
#RUN chown -R app:app $HOME/*

#USER app
WORKDIR $HOME/$APP_NAME

RUN npm install &&\
	npm cache clean

# Bundle app source
COPY . $HOME/$APP_NAME/

CMD ["ng", "serve", "--host", "0.0.0.0"]
