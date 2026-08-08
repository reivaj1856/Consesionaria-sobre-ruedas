# Frontend Dockerfile for Angular
FROM node:24-alpine AS builder
WORKDIR /app
ENV NG_DISABLE_VERSION_CHECK=true
COPY package*.json ./
RUN npm ci
COPY . .
RUN chmod -R +x node_modules/.bin || true
RUN npx ng build --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/ConcesionariaApp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
