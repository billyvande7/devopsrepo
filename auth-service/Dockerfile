# Use the official Go image as the base image
FROM golang:1.22-alpine

# Set the working directory in the container
WORKDIR /app

# Install build dependencies including python3 and its development files
RUN apk add --no-cache gcc musl-dev python3 python3-dev py3-pip curl

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app
RUN go build -o main .

# Expose the port the app runs on
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Command to run the executable
CMD ["./main"] 