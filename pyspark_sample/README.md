# PySpark Lightning Strike Analysis

This script demonstrates how to use PySpark and GC Dataproc to process a BigQuery table containing lightning strike data by U.S. county.

This script pulls data directly from a BigQuery table using the Hadoop-BigQuery connector, and converts nested JSON data into a structured Spark DataFrame. Then computes lightning strikes per square mile for each U.S. county and ranks the top counties by strike density. 

This script is designed to be run on a Dataproc cluster with appropriate permissions to access BigQuery and Google Cloud Storage.

