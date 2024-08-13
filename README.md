# Patient Prediction API

This project provides an API for predicting the number of patients based on historical data. It uses R with the Plumber package to create a RESTful API that accepts training data and future dates, then returns predictions for the number of patients on those future dates.

## Project Structure

- `plumber.R`: Contains the main prediction logic and API endpoint definition.
- `router.R`: Sets up the Plumber router and runs the API.
- `Dockerfile`: Defines the Docker image for running the API in a containerized environment.

## API Endpoint

The API exposes a single POST endpoint:

- `/predict_n`: Accepts training data and future dates, returns predictions for the number of patients.

## Usage Example

Here's an example of how to use the API with curl:

```bash
curl -X POST https://content-nourishment-production.up.railway.app/predict_n \
  -H "Content-Type: application/json" \
  -d '{
    "train_set": {
      "Data": [
        "2023-01-01", "2023-01-02", "2023-01-03", "2023-01-04", "2023-01-05",
        "2023-02-01", "2023-02-02", "2023-02-03", "2023-02-04", "2023-02-05",
        "2023-03-01", "2023-03-02", "2023-03-03", "2023-03-04", "2023-03-05",
        "2023-04-01", "2023-04-02", "2023-04-03", "2023-04-04", "2023-04-05",
        "2023-05-01", "2023-05-02", "2023-05-03", "2023-05-04", "2023-05-05",
        "2023-06-01", "2023-06-02", "2023-06-03", "2023-06-04", "2023-06-05",
        "2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05",
        "2023-08-01", "2023-08-02", "2023-08-03", "2023-08-04", "2023-08-05",
        "2023-09-01", "2023-09-02", "2023-09-03", "2023-09-04", "2023-09-05"
      ],
      "n": [
        10, 15, 12, 18, 20,
        22, 25, 23, 28, 30,
        18, 20, 22, 25, 28,
        30, 32, 35, 38, 40,
        25, 28, 30, 32, 35,
        38, 40, 42, 45, 48,
        50, 52, 55, 58, 60,
        45, 48, 50, 52, 55,
        40, 42, 45, 48, 50
      ]
    },
    "future_dates": {
      "Data": [
        "2023-09-06", "2023-09-07", "2023-09-08", "2023-09-09", "2023-09-10",
        "2023-10-01", "2023-10-02", "2023-10-03", "2023-10-04", "2023-10-05"
      ]
    }
  }'
```

### Example Response

```json
[
    {
        "Data": "2023-09-06",
        "n_pred": 44.2937
    },
    {
        "Data": "2023-09-07",
        "n_pred": 44.844
    },
    {
        "Data": "2023-09-08",
        "n_pred": 44.3345
    },
    {
        "Data": "2023-09-09",
        "n_pred": 44.5199
    },
    {
        "Data": "2023-09-10",
        "n_pred": 44.5199
    },
    {
        "Data": "2023-10-01",
        "n_pred": 35.7437
    },
    {
        "Data": "2023-10-02",
        "n_pred": 36.62
    },
    {
        "Data": "2023-10-03",
        "n_pred": 37.4533
    },
    {
        "Data": "2023-10-04",
        "n_pred": 35.5175
    },
    {
        "Data": "2023-10-05",
        "n_pred": 36.0678
    }
]
```

## Deployment

This API is deployed on Railway. The current URL is:

https://content-nourishment-production.up.railway.app/predict_n

You can use this URL to make predictions using the API.

## Running Locally with Docker

To run the API locally using Docker:

1. Build the Docker image:
   ```
   docker build -t patient-prediction-api .
   ```

2. Run the container:
   ```
   docker run -p 8080:8080 patient-prediction-api
   ```

The API will be available at `http://localhost:8080/predict_n`.

## Notes

- The API uses a linear regression model to make predictions based on the day of the week and month.
- The training data should include historical data for patient numbers, and the future dates should be the dates for which you want predictions.
- Ensure that your input data follows the format shown in the example above.
