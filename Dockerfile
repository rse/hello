
FROM        node:23-alpine

RUN         apk update && \
            apk upgrade && \
            apk add shadow && \
            rm -rf /var/cache/apk/*

RUN         groupadd -g 5000 app && \
            useradd -u 5000 -g app -d /app -m -s /bin/sh -p '!' -l app && \
            mkdir -p /app && \
            chown app:app /app
ENV         HOME=/app
USER        app:app
WORKDIR     /app

COPY        package.json hello.js ./
RUN         npm install --silent --production

ENTRYPOINT  [ "node", "/app/hello.js" ]

