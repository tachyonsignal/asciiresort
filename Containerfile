ARG version=1.23.0

FROM nginx:${version}-alpine AS builder

ARG version

WORKDIR /root/

RUN apk add --update alpine-sdk linux-headers pcre-dev openssl-dev zlib-dev
RUN wget http://nginx.org/download/nginx-${version}.tar.gz \
    && tar zxf nginx-${version}.tar.gz \
    && git clone https://github.com/google/ngx_brotli.git \
    && cd ngx_brotli \
    && git submodule update --init --recursive \
    && cd ../nginx-${version} \
    && ./configure \
    --add-dynamic-module=../ngx_brotli \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --http-client-body-temp-path=/var/cache/nginx/client_temp \
    --http-proxy-temp-path=/var/cache/nginx/proxy_temp \
    --http-fastcgi-temp-path=/var/cache/nginx/fastcgi_temp \
    --http-uwsgi-temp-path=/var/cache/nginx/uwsgi_temp \
    --http-scgi-temp-path=/var/cache/nginx/scgi_temp \
    --with-perl_modules_path=/usr/lib/perl5/vendor_perl \
    --user=nginx \
    --group=nginx \
    --with-compat \
    --with-file-aio \
    --with-threads \
    --with-http_addition_module \
    --with-http_auth_request_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_mp4_module \
    --with-http_random_index_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-http_slice_module \
    --with-http_ssl_module \
    --with-http_stub_status_module \
    --with-http_sub_module \
    --with-http_v2_module \
    --with-mail \
    --with-mail_ssl_module \
    --with-stream \
    --with-stream_realip_module \
    --with-stream_ssl_module \
    --with-stream_ssl_preread_module \
    --with-cc-opt='-Os -fomit-frame-pointer -g' \
    --with-ld-opt=-Wl,--as-needed,-O1,--sort-common \
    && make modules
# End compiling of Brotli module.

FROM nginx:${version}-alpine
ARG version
ENV TIME_ZONE=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TIME_ZONE /etc/localtime && echo $TIME_ZONE > /etc/timezone
# Don't need to to do on the fly compilation.
# COPY --from=builder /root/nginx-${version}/objs/ngx_http_brotli_filter_module.so /usr/lib/nginx/modules/
COPY --from=builder /root/nginx-${version}/objs/ngx_http_brotli_static_module.so /usr/lib/nginx/modules/

RUN apk add minify brotli
COPY nginx.conf /etc/nginx/nginx.conf
RUN ["nginx", "-t"]

# Build the static assets.
WORKDIR /src
COPY src .
RUN ["minify", "--output", "/usr/share/nginx/html", "--recursive", "."]

WORKDIR /usr/share/nginx/html
# must escape style.css before using as replace in sed: https://stackoverflow.com/questions/407523/escape-a-string-for-a-sed-replace-pattern
# there is a warning ^ that it may not work on new lines, so may be problem if minified style.css we have this point is multiline.
# there have been cases where the minifier does not minifier the HTML to a single line, so this may be a problem for CSS, too
# must run command sequential to have env variable: https://vsupalov.com/set-dynamic-environment-variable-during-docker-image-build/
RUN ESCAPED_CSS=$(cat style.css | sed -e 's/[]\/$*.^[]/\\&/g'); sed -i "s?@import \"style.css\"?$ESCAPED_CSS?g" index.html
RUN ["find", ".", "-type", "f", "-exec", "brotli", "{}", "+"]
RUN head -1 index.html
RUN ["ls", "-Rla", "/usr/share/nginx/html"]
