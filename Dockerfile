FROM rocker/verse:4.2.0

RUN apt-get update && apt-get install -y \
    git-core \
    libcurl4-openssl-dev \
    libgit2-dev \
    libicu-dev \
    libsodium-dev \
    libssl-dev \
    libxml2-dev \
    make \
    pandoc \
    pandoc-citeproc \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

RUN echo "options(repos = c(CRAN = 'https://cran.rstudio.com/'), download.file.method = 'libcurl', Ncpus = 4)" >> /usr/local/lib/R/etc/Rprofile.site

# Install required R packages
RUN R -e 'install.packages("remotes")'
RUN Rscript -e 'remotes::install_version("plumber", upgrade="never", version = "1.2.0")'
RUN Rscript -e 'remotes::install_version("lubridate", upgrade="never", version = "1.8.0")'
RUN Rscript -e 'remotes::install_version("jsonlite", upgrade="never", version = "1.8.4")'

# Create and set working directory
RUN mkdir /app
WORKDIR /app

# Copy application files
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Expose port 8080
EXPOSE 8080

# Run the API
ENTRYPOINT ["R", "-e", "library(plumber); library(lubridate); library(jsonlite); pr <- plumb('plumber.R'); pr$run(port=8080, host='0.0.0.0')"]