FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y git
USER jenkins
