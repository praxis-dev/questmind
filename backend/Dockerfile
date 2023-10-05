# Use the official Node.js image as a base
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install the app dependencies
COPY package*.json ./
RUN yarn install

# Bundle the app source code
COPY . .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["yarn", "start:dev"]
