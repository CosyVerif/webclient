FROM cosyverif/docker-images:openresty
MAINTAINER Alban Linard <alban@linard.fr>

ADD .           /src/cosy/webclient
ADD mime.types  /data/mime.types
ADD nginx.conf  /data/nginx.conf

RUN     apk add --no-cache --virtual .build-deps \
            build-base \
            make \
            perl \
            openssl-dev \
            nodejs \
    &&  cd /src/cosy/webclient/ \
    &&  luarocks install rockspec/lulpeg-develop-0.rockspec \
    &&  luarocks make    rockspec/cosy-webclient-master-1.rockspec \
    &&  mkdir -p /data/logs \
    &&  cp -r src/www /data/www \
    &&  ./bin/dependencies \
    &&  rm -rf /src/cosy/webclient \
    &&  apk del .build-deps

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx"]
CMD ["-p", "/data", "-c", "/data/nginx.conf"]
