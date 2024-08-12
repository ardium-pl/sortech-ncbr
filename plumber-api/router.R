# Install & load packages
if (!require("plumber")) {
  install.packages("plumber")
}

if (!require("lubridate")) {
  install.packages("lubridate")
}

library(plumber)
library(lubridate)

# Error handlers
error_handler_500 <- function(req, res, err) {
  res$status <- 500
  list(error = "Custom Error Message")
}

error_handler_404 <- function(req, res) {
  res$status <- 404
  list(Error_404 = "Page not found :(")
}

# Define the path to your plumber.R file
plumber_file <- "plumber.R"

# Create a router
router <- plumb(plumber_file)

# Set error handlers
router$setErrorHandler(error_handler_500)
router$set404Handler(error_handler_404)

# Run the API
router$run(host = "0.0.0.0", port = 8080)