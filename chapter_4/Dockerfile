# Use an official node.js runtime as a parent image
FROM node:22-alpine

# Set the working director in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container; the syntax says every file that contains package and is a json wll be added to the /app directory indicated by the period
COPY package*.json .

# Install dependencies; will install all dependecies in the docker environment
RUN npm install

# Copy the rest of the application code to the container; current file to destination
COPY . .

#Expose the port the application runs on; opens up the port to network traffic
EXPOSE 5003

#Define the command to run the application
CMD ["node", "./src/server.js"]


