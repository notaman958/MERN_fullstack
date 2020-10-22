FROM node:latest
COPY . /opt/fullstack
WORKDIR /opt/fullstack
CMD ["npm","run","start"]
