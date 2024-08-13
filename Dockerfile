# Use the official rstudio/plumber base image
FROM rstudio/plumber

# Create the /app directory inside the container
WORKDIR /app

# Copy your R scripts into the /app directory in the container
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Install the lubridate package during the image build
RUN R -e "install.packages('lubridate', repos='https://cloud.r-project.org')"

# Set the entrypoint to run a shell script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]