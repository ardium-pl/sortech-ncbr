print("Starting router.R")

tryCatch({
  print("Loading libraries")
  library(plumber)
  library(lubridate)
  library(jsonlite)
  print("Libraries loaded successfully")

  # Error handlers
  error_handler_500 <- function(req, res, err) {
    res$status <- 500
    list(error = "Custom Error Message", details = as.character(err))
  }

  error_handler_404 <- function(req, res) {
    res$status <- 404
    list(Error_404 = "Page not found :(")
  }

  print("Creating Plumber router")
  # Create a router
  pr <- Plumber$new("plumber.R")
  print("Plumber router created successfully")

  # Set error handlers
  pr$setErrorHandler(error_handler_500)
  pr$setNotFoundHandler(error_handler_404)

  # Logging filter
  pr$filter("logger", function(req){
    cat(as.character(Sys.time()), "-", 
        req$REQUEST_METHOD, req$PATH_INFO, "-", 
        req$HTTP_USER_AGENT, "@", req$REMOTE_ADDR, "\n")
    plumber::forward()
  })

  # Get port from environment variable or use default
  port <- as.numeric(Sys.getenv("PORT", 8080))
  print(paste("Using port:", port))

  print("Starting API")
  # Run the API
  pr$run(host = "0.0.0.0", port = port)

}, error = function(e) {
  print(paste("Error in router.R:", e))
  print(traceback())
  stop(e)
})