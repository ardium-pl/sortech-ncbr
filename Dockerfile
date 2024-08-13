# Use the official rocker/r-ver base image
FROM rocker/r-ver:4.1.0

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN R -e "install.packages(c('plumber', 'lubridate'), repos='https://cloud.r-project.org/', dependencies=TRUE)"

# Create app directory
WORKDIR /app

# Copy R scripts
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Expose port 8080
EXPOSE 8080

# Run the API
CMD ["Rscript", "router.R"]