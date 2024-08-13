FROM rocker/r-ver:latest

# Install OS dependencies
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  libssl-dev \
  libcurl4-gnutls-dev \
  libsodium-dev \
  libxml2-dev \
  && rm -rf /var/lib/apt/lists/*

# Install R packages
RUN R -e "install.packages(c('plumber', 'lubridate', 'jsonlite'), repos='https://cloud.r-project.org/')"

# Setup workspace
COPY . /app
WORKDIR /app

# Run the API
ENTRYPOINT ["Rscript"]
CMD ["router.R"]

EXPOSE 8080