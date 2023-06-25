FROM jenkins/jenkins:lts-jdk11

MAINTAINER malachai<prussian1933@naver.com>

USER root

# Utility Installation
RUN \
   apt-get update && \
   apt-get install -y wget curl vim

# Docker Installation
RUN \
    apt-get update && \
    apt-get install ca-certificates curl gnupg lsb-release -y && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y

# Docker Compose Installation
RUN \
    curl -SL https://github.com/docker/compose/releases/download/v2.15.1/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose && \
    ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Maven Installation
RUN \
    wget https://dlcdn.apache.org/maven/maven-3/3.9.0/binaries/apache-maven-3.9.0-bin.tar.gz && \
    tar -xvzf apache-maven-3.9.0-bin.tar.gz && \
    mv apache-maven-3.9.0 /usr/local/lib/apache-maven-3.9.0
ENV MAVEN_HOME=/usr/local/lib/apache-maven-3.9.0
ENV PATH=$PATH:$MAVEN_HOME/bin

# NodeJS Installation
ENV NODE_VERSION=19.7.0
RUN \
    apt install -y curl && \
    apt install -y build-essential && \
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install node && \
    ln -sf $NVM_DIR/versions/node/v$NODE_VERSION/bin/node /usr/bin/nodejs && \
    ln -sf $NVM_DIR/versions/node/v$NODE_VERSION/bin/node /usr/bin/node && \
    ln -sf $NVM_DIR/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm