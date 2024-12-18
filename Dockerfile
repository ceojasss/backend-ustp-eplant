FROM node:16
# USER root
WORKDIR /tmp
RUN apt-get update && apt-get -y upgrade && apt-get -y dist-upgrade && apt-get install -y alien libaio1
RUN wget https://yum.oracle.com/repo/OracleLinux/OL7/oracle/instantclient/x86_64/getPackage/oracle-instantclient19.3-basiclite-19.3.0.0.0-1.x86_64.rpm
RUN alien -i --scripts oracle-instantclient*.rpm
RUN rm -f oracle-instantclient19.3*.rpm && apt-get -y autoremove && apt-get -y clean
WORKDIR /app/backend
# RUN mkdir uploads && chmod -R 777 uploads
# RUN chmod +x /app/backend/uploads
COPY package.json ./
RUN npm install
# RUN chown root:root /app/backend/
