# Use the official Node.js image with Alpine Linux
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the package and package-lock to the working directory in the container
COPY package*.json ./

# Install dependecies
RUN npm install

# Copy the contents of the current directory to the working directory in the container
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the container with a shell
CMD ["npm", "run", "dev"]
