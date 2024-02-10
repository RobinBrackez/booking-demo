FROM php:8.3-fpm-alpine

# install packages
RUN apk update && apk add \
        bash \
        vim \
        openssl \
        zip \
        libzip-dev \
        htop \
        unzip \
        git \
        icu-dev \
        && docker-php-ext-install pdo_mysql zip \
        && docker-php-ext-install intl \
        && docker-php-ext-install pcntl

RUN apk add postgresql-dev && \
    docker-php-ext-install pdo_pgsql pgsql

RUN apk add acl

RUN apk add autoconf g++ --update linux-headers make \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug

RUN mkdir -p /app

RUN echo http://dl-2.alpinelinux.org/alpine/edge/community/ >> /etc/apk/repositories
RUN apk --no-cache add shadow && usermod -u 1000 www-data

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Include composer
ENV COMPOSER_VERSION 2.6
ENV COMPOSER_HOME /var/www/.composer
ENV PATH vendor/bin:$COMPOSER_HOME/vendor/bin:$PATH

RUN mkdir -p $COMPOSER_HOME/cache && \
    chown -R www-data:www-data /var/www && \
    echo "xdebug.mode=debug" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini && \
    echo "xdebug.start_with_request=trigger" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini && \
    echo "xdebug.discover_client_host = 1" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini && \
    echo "xdebug.client_host = 172.17.0.1" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini && \
    echo "xdebug.client_port = 9900" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini && \
    echo "xdebug.idekey = PhpStorm1" >> /usr/local/etc/php/conf.d/docker-php-pecl-xdebug.ini

RUN chown -R www-data:www-data $COMPOSER_HOME

COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint

WORKDIR /app
COPY composer.lock composer.json ./
RUN chown -R www-data:www-data composer.lock composer.json /app

ENTRYPOINT ["docker-entrypoint"]

USER www-data