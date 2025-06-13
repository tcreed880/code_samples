# PySpark Lightning Strike Analysis

This script demonstrates how to use **PySpark** and **Google Cloud Dataproc** to process a BigQuery table containing lightning strike data by U.S. county. It serves as a simple example to showcase working knowledge of distributed data processing and Spark SQL.

### Key Features:
- Pulls data directly from a BigQuery table using the Hadoop-BigQuery connector.
- Converts nested JSON data into a structured Spark DataFrame.
- Computes lightning strikes per square mile for each U.S. county.
- Ranks and displays the top 10 counties by lightning strike density.
- Uses Spark SQL and PySpark transformations for analysis.
- Cleans up temporary storage after execution.

### Technologies Used:
- PySpark (RDDs and DataFrames)
- Google Cloud Dataproc
- BigQuery InputFormat for Hadoop
- Spark SQL

This script is designed to be run on a Dataproc cluster with appropriate permissions to access BigQuery and Google Cloud Storage.

