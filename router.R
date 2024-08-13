# Load packages
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
pr <- Plumber$new(plumber_file)

# Set error handlers
pr$setErrorHandler(error_handler_500)
pr$setNotFoundHandler(error_handler_404)

# Add CORS support
pr$filter("CORS", function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res$setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  
  if (req$REQUEST_METHOD == "OPTIONS") {
    res$status <- 200
    return(list())
  }
})

# Get port from environment variable or use default
port <- as.numeric(Sys.getenv("PORT", 8080))

# Run the API
pr$run(host = "0.0.0.0", port = port)