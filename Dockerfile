FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginxinc/nginx-unprivileged:alpine-slim

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

USER nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
