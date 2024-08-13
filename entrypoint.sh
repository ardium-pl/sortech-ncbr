#!/bin/bash

echo "Contents of plumber.R:"
cat /app/plumber.R
echo "------------------------"
echo "Contents of router.R:"
cat /app/router.R
echo "------------------------"
echo "Running router.R"
Rscript /app/router.R