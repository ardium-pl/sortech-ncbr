# plumber.R


#* Echo back the input
#* @param msg The message to echo
#* @get /echo
function(msg) {
  list(msg = paste("The message is:", msg))
}


#* Return the sum of two numbers
#* @param a The first number to add
#* @param b The second number to add
#* @post /sum
#* @get /sum
function(a, b) {
  as.numeric(a) + as.numeric(b)
}


#* Predict house prices
#* @param train_set The JSON payload containing the train set for the model
#* @param predictors The JSON payload containing the predictors
#* @post /predict_house_price
function(train_set, predictors) {
  # Parse JSON payload
  train_set <- as.data.frame(train_set)
  predictors <- as.data.frame(predictors)
  
  # Construct the model
  model <- lm(price ~ area + centre, data = train_set)
  
  # Make predictions
  n_pred <- predict(model, predictors)
  
  # Compose output
  result <- cbind(predictors, n_pred)
  
  # Return result as JSON
  result
}


#* Predict number of patients
#* @param train_set The JSON payload containing the train set for the model
#* @param future_dates The JSON payload containing the dates for which predictions will be made
#* @post /predict_n
function(train_set, future_dates) {
  # Parse JSON payload
  train_set <- as.data.frame(train_set)
  future_dates <- as.data.frame(future_dates)
  
  # Convert to proper date format
  train_set$Data <- lubridate::ymd(train_set$Data)
  future_dates$Data <- lubridate::ymd(future_dates$Data)
  
  # Add new columns (dummy variables) - train_set
  train_set$wday <- wday(train_set$Data, week_start = 1)
  train_set$month <- month(train_set$Data)
  train_set$day <- seq(1, nrow(train_set))
  
  train_set$m1 <- ifelse(train_set$month == 1, 1, 0)
  train_set$m2 <- ifelse(train_set$month == 2, 1, 0)
  train_set$m3 <- ifelse(train_set$month == 3, 1, 0)
  train_set$m4 <- ifelse(train_set$month == 4, 1, 0)
  train_set$m5 <- ifelse(train_set$month == 5, 1, 0)
  train_set$m6 <- ifelse(train_set$month == 6, 1, 0)
  train_set$m7 <- ifelse(train_set$month == 7, 1, 0)
  train_set$m8 <- ifelse(train_set$month == 8, 1, 0)
  train_set$m9 <- ifelse(train_set$month == 9, 1, 0)
  train_set$m10 <- ifelse(train_set$month == 10, 1, 0)
  train_set$m11 <- ifelse(train_set$month == 11, 1, 0)
  train_set$m12 <- ifelse(train_set$month == 12, 1, 0)
  
  train_set$w1 <- ifelse(train_set$wday == 1, 1, 0)
  train_set$w2 <- ifelse(train_set$wday == 2, 1, 0)
  train_set$w3 <- ifelse(train_set$wday == 3, 1, 0)
  train_set$w4 <- ifelse(train_set$wday == 4, 1, 0)
  train_set$w5 <- ifelse(train_set$wday == 5, 1, 0)
  train_set$w6 <- ifelse(train_set$wday == 6, 1, 0)
  train_set$w7 <- ifelse(train_set$wday == 7, 1, 0)
  
  
  # Add new columns (dummy variables) - future_dates
  future_dates$wday <- wday(future_dates$Data, week_start = 1)
  future_dates$month <- month(future_dates$Data)
  future_dates$day <- seq(1, nrow(future_dates))
  
  future_dates$m1 <- ifelse(future_dates$month == 1, 1, 0)
  future_dates$m2 <- ifelse(future_dates$month == 2, 1, 0)
  future_dates$m3 <- ifelse(future_dates$month == 3, 1, 0)
  future_dates$m4 <- ifelse(future_dates$month == 4, 1, 0)
  future_dates$m5 <- ifelse(future_dates$month == 5, 1, 0)
  future_dates$m6 <- ifelse(future_dates$month == 6, 1, 0)
  future_dates$m7 <- ifelse(future_dates$month == 7, 1, 0)
  future_dates$m8 <- ifelse(future_dates$month == 8, 1, 0)
  future_dates$m9 <- ifelse(future_dates$month == 9, 1, 0)
  future_dates$m10 <- ifelse(future_dates$month == 10, 1, 0)
  future_dates$m11 <- ifelse(future_dates$month == 11, 1, 0)
  future_dates$m12 <- ifelse(future_dates$month == 12, 1, 0)
  
  future_dates$w1 <- ifelse(future_dates$wday == 1, 1, 0)
  future_dates$w2 <- ifelse(future_dates$wday == 2, 1, 0)
  future_dates$w3 <- ifelse(future_dates$wday == 3, 1, 0)
  future_dates$w4 <- ifelse(future_dates$wday == 4, 1, 0)
  future_dates$w5 <- ifelse(future_dates$wday == 5, 1, 0)
  future_dates$w6 <- ifelse(future_dates$wday == 6, 1, 0)
  future_dates$w7 <- ifelse(future_dates$wday == 7, 1, 0)
  
  # Create linear model
  model <- lm(n ~ m1 + m2 + m7 + m9 + w1 + w2 + w3 + w4 + w5, data=train_set)
  
  # Calculate predictions for 12 months
  n_pred <- predict(model, future_dates[, c('m1', 'm2', 'm7', 'm9', 'w1', 'w2', 'w3', 'w4', 'w5')])
  
  # Create response body
  predictions_df <- data.frame(Data = future_dates$Data, n_pred = n_pred)
  
  # Error metrics in 2019
  # mse_lm <- mse(n_pred, ts_test$n)
  # mape_lm <- mape(n_pred, ts_test$n)
  
  # Return result as JSON
  predictions_df
}


#* Plot out data from the iris dataset
#* @param spec If provided, filter the data to only this species (e.g. 'setosa')
#* @get /plot
#* @serializer png
function(spec){
  myData <- iris
  title <- "All Species"
  
  # Filter if the species was specified
  if (!missing(spec)){
    title <- paste0("Only the '", spec, "' Species")
    myData <- subset(iris, Species == spec)
  }
  
  plot(myData$Sepal.Length, myData$Petal.Length,
       main=title, xlab="Sepal Length", ylab="Petal Length")
}

