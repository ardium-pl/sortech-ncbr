# Use the official rstudio/plumber base image
FROM rstudio/plumber

# Create the /app directory inside the container
WORKDIR /app

# Copy your R scripts into the /app directory in the container
COPY plumber.R /app/plumber.R
COPY router.R /app/router.R

# Install required packages
RUN R -e "install.packages(c('plumber', 'lubridate', 'jsonlite', 'conflicted'), repos='https://cloud.r-project.org/', dependencies=TRUE)"

# Expose the port the app runs on
EXPOSE 8080

# Run the API
CMD ["Rscript", "/app/router.R"]

# Set the entrypoint to run a shell script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]