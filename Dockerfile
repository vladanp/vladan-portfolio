# Use the latest Alpine image
FROM alpine:latest

RUN apk add --no-cache hugo

WORKDIR /usr/src/app

COPY . .

EXPOSE 1313

CMD ["hugo", "server", "--bind", "0.0.0.0", "--baseURL", "http://localhost:1313", "--watch", "--disableFastRender"]
