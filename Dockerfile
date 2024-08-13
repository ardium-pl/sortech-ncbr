# Use the official R base image
FROM r-base:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    libssl-dev \
    libxml2-dev \
    libsodium-dev \
    pkg-config


# Install R packages
RUN R -e "install.packages(c('plumber', 'lubridate'), repos='http://cran.rstudio.com/')"

# Create app directory
WORKDIR /app

# Copy R scripts
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Expose port 8080
EXPOSE 8080

# Run the API
CMD ["Rscript", "router.R"]