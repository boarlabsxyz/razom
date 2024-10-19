# Use the official Node.js 22 image
FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app

COPY ./veterans .
RUN npm ci && npm cache clean --force

# Expose the port the app runs on (assuming it's 3000, change if different)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]