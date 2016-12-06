FROM cosyverif/docker-images:openresty
MAINTAINER Alban Linard <alban@linard.fr>

ADD .           /src/cosy/webclient
ADD mime.types  /mime.types
ADD nginx.conf  /nginx.conf

RUN     apk add --no-cache --virtual .build-deps \
            build-base \
            make \
            perl \
            openssl-dev \
            nodejs \
    &&  cd /src/cosy/webclient/ \
    &&  luarocks install rockspec/lulpeg-develop-0.rockspec \
    &&  luarocks make    rockspec/cosy-webclient-master-1.rockspec \
    &&  mkdir -p /data \
    &&  cp -r src/www /data/www \
    &&  ./bin/dependencies \
    &&  rm -rf /src/cosy/webclient \
    &&  apk del .build-deps

ENTRYPOINT ["lapis"]
CMD ["server", "development"]
