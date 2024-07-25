# Use the official Node.js image as a base image
FROM node:20.11.0-alpine as builder

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies for building native modules

RUN apk --no-cache add \
    python3 \
    make \
    g++ \
    pkgconfig \
    pixman-dev \
    cairo-dev \
    pango-dev 



# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 8000

# Start the application
CMD [ "npm","run", "start:prod" ]
