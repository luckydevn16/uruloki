# Use an official Node.js runtime as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Initialize prisma if not already done
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Set the command to run your application
CMD ["npm", "start"]