# This dockerfile uses the ubuntu image
FROM node:8

MAINTAINER ballingunag

EXPOSE 8082

RUN apt-get update
RUN apt-get install -y git redis-server mongodb 

WORKDIR ~
RUN git clone https://github.com/ballinhuang/CSaaS-Cloud.git

WORKDIR CSaaS-Cloud
RUN npm install 
RUN sh setup.sh 127.0.0.1 
RUN npm run initapp
RUN npm run build

CMD sh startup.sh