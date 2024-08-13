# Use a minimal base image
FROM rocker/r-ver:4.1.0

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Install system dependencies and R packages in one layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcurl4-openssl-dev \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && R -e "install.packages(c('plumber', 'lubridate'), repos='https://cloud.r-project.org/', dependencies=TRUE)"

# Create app directory and copy R scripts
WORKDIR /app
COPY plumber.R router.R ./

# Expose port 8080 and run the API
EXPOSE 8080
CMD ["Rscript", "router.R"]