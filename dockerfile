# This dockerfile uses the ubuntu image
FROM ubuntu

MAINTAINER ballingunag

RUN apt-get update
RUN apt-get install -y apt-utils
RUN apt-get install -y git curl gnupg redis-server mongodb 
# RUN redis-server --daemonize yes

# RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

WORKDIR ~
RUN git clone https://github.com/ballinhuang/CSaaS-Cloud.git

WORKDIR CSaaS-Cloud
RUN npm install 
RUN sh setup.sh 127.0.0.1 
RUN npm run initapp
RUN npm run build