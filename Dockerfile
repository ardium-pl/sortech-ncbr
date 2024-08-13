FROM rocker/r-ver:latest

# Install OS dependencies
RUN apt-get update -qq && apt-get install -y --no-install-recommends \
  git-core \
  libssl-dev \
  libcurl4-gnutls-dev \
  curl \
  libsodium-dev \
  libxml2-dev \
  && rm -rf /var/lib/apt/lists/*

# Install pak as an alternative to install.packages
RUN Rscript -e "install.packages('pak', repos = sprintf('https://r-lib.github.io/p/pak/stable'))"

# Install latest plumber from GitHub main branch
RUN Rscript -e "pak::pkg_install('rstudio/plumber@main')"

# Install other R packages
RUN Rscript -e "pak::pkg_install(c('lubridate', 'jsonlite'))"

# Setup workspace
COPY . /app
WORKDIR /app

# Run the API
ENTRYPOINT ["Rscript"]
CMD ["router.R"]

EXPOSE 8080