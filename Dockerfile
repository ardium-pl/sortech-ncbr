# Use a specific Ubuntu base image
FROM ubuntu:20.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install system dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    dirmngr \
    apt-transport-https \
    lsb-release \
    ca-certificates \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    libsodium-dev \
    pkg-config \
    r-base \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN R -e "install.packages(c('plumber', 'lubridate', 'jsonlite'), repos='https://cloud.r-project.org/', dependencies=TRUE)"

# Create app directory
WORKDIR /app

# Copy R scripts
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Expose port 8080
EXPOSE 8080

# Run the API
CMD ["Rscript", "router.R"]