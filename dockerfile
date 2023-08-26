FROM node:latest as build

# Create and set the working directory on the container
# then copy over the package.json and package-lock.json
WORKDIR /frontend
COPY package*.json ./

# Install the node packages before copying the files
RUN npm ci

COPY public/ public

COPY . .

# build your app
RUN npm run build

# production environment
FROM nginx:alpine as production
COPY --from=build /frontend/build /usr/share/nginx/html
RUN rm /usr/share/nginx/html/50x.html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]