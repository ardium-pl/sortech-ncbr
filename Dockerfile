FROM rocker/r-ver:latest

# Install OS dependencies
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  libssl-dev \
  libcurl4-gnutls-dev \
  libsodium-dev \
  libxml2-dev \
  zlib1g-dev \
  && rm -rf /var/lib/apt/lists/*

# Install R packages and verify installation
RUN R -e "install.packages(c('plumber', 'lubridate', 'jsonlite'), repos='https://cloud.r-project.org/', dependencies=TRUE)" && \
    R -e "if(!require(plumber)) stop('plumber not installed')" && \
    R -e "if(!require(lubridate)) stop('lubridate not installed')" && \
    R -e "if(!require(jsonlite)) stop('jsonlite not installed')"

# Setup workspace
COPY . /app
WORKDIR /app

# Run the API
CMD ["Rscript", "-e", "library(plumber); pr <- plumb('plumber.R'); pr$run(host='0.0.0.0', port=as.numeric(Sys.getenv('PORT', 8080)))"]

EXPOSE 8080