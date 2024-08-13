library(plumber)

# Create a router
pr <- plumb("plumber.R")

# Run the API
pr$run(host = "0.0.0.0", port = as.numeric(Sys.getenv("PORT", 8080)))