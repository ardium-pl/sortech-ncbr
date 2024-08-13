#* Predict number of patients
#* @param train_set The JSON payload containing the train set for the model
#* @param future_dates The JSON payload containing the dates for which predictions will be made
#* @post /predict_n
function(train_set, future_dates) {
  # Parse JSON payload
  ts_model <- as.data.frame(train_set)
  ts_future <- as.data.frame(future_dates)
  
  # Convert to proper date format
  ts_model$Data <- lubridate::ymd(ts_model$Data)
  ts_future$Data <- lubridate::ymd(ts_future$Data)
  
  ts_future$n <- NA
  
  # Add new columns - ts_model
  ts <- ts_model
  ts$wday <- lubridate::wday(ts$Data, week_start = 1)
  ts$month_val <- lubridate::month(ts$Data) # Renaming to avoid conflict
  ts$day_seq <- seq_len(nrow(ts))
  
  ts$m1 <- ifelse(ts$month_val == 1, 1, 0)
  ts$m2 <- ifelse(ts$month_val == 2, 1, 0)
  ts$m3 <- ifelse(ts$month_val == 3, 1, 0)
  ts$m4 <- ifelse(ts$month_val == 4, 1, 0)
  ts$m5 <- ifelse(ts$month_val == 5, 1, 0)
  ts$m6 <- ifelse(ts$month_val == 6, 1, 0)
  ts$m7 <- ifelse(ts$month_val == 7, 1, 0)
  ts$m8 <- ifelse(ts$month_val == 8, 1, 0)
  ts$m9 <- ifelse(ts$month_val == 9, 1, 0)
  ts$m10 <- ifelse(ts$month_val == 10, 1, 0)
  ts$m11 <- ifelse(ts$month_val == 11, 1, 0)
  ts$m12 <- ifelse(ts$month_val == 12, 1, 0)
  
  ts$w1 <- ifelse(ts$wday == 1, 1, 0)
  ts$w2 <- ifelse(ts$wday == 2, 1, 0)
  ts$w3 <- ifelse(ts$wday == 3, 1, 0)
  ts$w4 <- ifelse(ts$wday == 4, 1, 0)
  ts$w5 <- ifelse(ts$wday == 5, 1, 0)
  ts$w6 <- ifelse(ts$wday == 6, 1, 0)
  ts$w7 <- ifelse(ts$wday == 7, 1, 0)
  
  # Create linear model
  model <- lm(n ~ m1 + m2 + m7 + m9 + w1 + w2 + w3 + w4 + w5, data=ts)
  
  # Add new columns (dummy variables) - ts_future
  ts <- ts_future
  ts$wday <- lubridate::wday(ts$Data, week_start = 1)
  ts$month_val <- lubridate::month(ts$Data)
  ts$day_seq <- seq_len(nrow(ts))
  
  ts$m1 <- ifelse(ts$month_val == 1, 1, 0)
  ts$m2 <- ifelse(ts$month_val == 2, 1, 0)
  ts$m7 <- ifelse(ts$month_val == 7, 1, 0)
  ts$m9 <- ifelse(ts$month_val == 9, 1, 0)
  
  ts$w1 <- ifelse(ts$wday == 1, 1, 0)
  ts$w2 <- ifelse(ts$wday == 2, 1, 0)
  ts$w3 <- ifelse(ts$wday == 3, 1, 0)
  ts$w4 <- ifelse(ts$wday == 4, 1, 0)
  ts$w5 <- ifelse(ts$wday == 5, 1, 0)
  
  # Calculate predictions
  n_pred <- unname(predict(model, ts[, c("m1", "m2", "m7", "m9", "w1", "w2", "w3", "w4", "w5")]))
  
  # Create response body
  predictions_df <- data.frame(Data = ts$Data, n_pred = n_pred)
  
  # Return result as JSON
  predictions_df
}