FROM ubuntu:22.04

# Install Node.js
RUN apt update && apt install -y nodejs npm

WORKDIR /app

# Copy package files
COPY package.json server.js ./

# Copy ALL 5 binaries
COPY neo1 neo2 neo3 neo4 neo5 /app/

# Install dependencies
RUN npm install

# Make all binaries executable
RUN chmod +x /app/neo1 /app/neo2 /app/neo3 /app/neo4 /app/neo5

EXPOSE 8080

CMD ["node", "server.js"]
