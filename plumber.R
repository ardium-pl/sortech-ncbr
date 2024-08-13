library(plumber)
library(lubridate)

#* Predict number of patients
#* @param train_set The JSON payload containing the train set for the model
#* @param future_dates The JSON payload containing the dates for which predictions will be made
#* @post /predict_n
function(train_set, future_dates) {
  # Parse JSON payload
  ts_model <- jsonlite::fromJSON(train_set)
  ts_future <- jsonlite::fromJSON(future_dates)
  
  # Convert to proper date format
  ts_model$Data <- ymd(ts_model$Data)
  ts_future$Data <- ymd(ts_future$Data)
  
  ts_future$n <- NA
  
  # Add new columns - ts_model
  ts <- ts_model
  ts$wday <- wday(ts$Data, week_start = 1)
  ts$month <- month(ts$Data)
  ts$day <- seq(1:length(ts$Data))
  
  # Create dummy variables
  for (i in 1:12) {
    ts[[paste0("m", i)]] <- as.integer(ts$month == i)
  }
  
  for (i in 1:7) {
    ts[[paste0("w", i)]] <- as.integer(ts$wday == i)
  }
  
  # Create linear model
  model <- lm(n ~ m1 + m2 + m7 + m9 + w1 + w2 + w3 + w4 + w5, data=ts)
  
  # Add new columns (dummy variables) - ts_future
  ts <- ts_future
  ts$wday <- wday(ts$Data, week_start = 1)
  ts$month <- month(ts$Data)
  ts$day <- seq(1:length(ts$Data))
  
  ts$m1 <- as.integer(ts$month == 1)
  ts$m2 <- as.integer(ts$month == 2)
  ts$m7 <- as.integer(ts$month == 7)
  ts$m9 <- as.integer(ts$month == 9)
  
  ts$w1 <- as.integer(ts$wday == 1)
  ts$w2 <- as.integer(ts$wday == 2)
  ts$w3 <- as.integer(ts$wday == 3)
  ts$w4 <- as.integer(ts$wday == 4)
  ts$w5 <- as.integer(ts$wday == 5)
  
  # Calculate predictions
  n_pred <- predict(model, ts[, c("m1", "m2", "m7", "m9", "w1", "w2", "w3", "w4", "w5")])
  
  # Create response body
  predictions_df <- data.frame(Data = ts$Data, n_pred = n_pred)
  
  # Return result as JSON
  jsonlite::toJSON(predictions_df)
}