# Use the official Node.js 22 image
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (assuming it's 3000, change if different)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]