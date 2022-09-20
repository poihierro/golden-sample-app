FROM repo.backbase.com/backbase-docker-releases/web-base:latest

COPY ./dist/apps/golden-sample-app /statics

COPY ./docker/api-proxy.conf    /nginx-config/server/api-proxy.conf
COPY ./docker/csp.conf          /nginx-config/server/index/20-csp.conf