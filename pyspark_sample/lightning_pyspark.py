import pyspark
from pyspark.sql import SparkSession
import pprint
import json
from pyspark.sql.types import StructType, FloatType, LongType, StringType, StructField
from pyspark.sql import Window
from pyspark.sql.functions import lead, udf, struct, col

sc = pyspark.SparkContext()

#PACKAGE_EXTENSIONS= ('gs://hadoop-lib/bigquery/bigquery-connector-hadoop2-latest.jar')

bucket = sc._jsc.hadoopConfiguration().get('fs.gs.system.bucket')
project = sc._jsc.hadoopConfiguration().get('fs.gs.project.id')
input_directory = 'gs://{}/hadoop/tmp/bigquerry/pyspark_input'.format(bucket)
output_directory = 'gs://{}/pyspark_demo_output'.format(bucket)

spark = SparkSession \
  .builder \
  .master('yarn') \
  .appName('lightning') \
  .getOrCreate()

# define data locations
conf={
    'mapred.bq.project.id':project,
    'mapred.bq.gcs.bucket':bucket,
    'mapred.bq.temp.gcs.path':input_directory,
    'mapred.bq.input.project.id': 'folkloric-union-411318',
    'mapred.bq.input.dataset.id': 'lightning',
    'mapred.bq.input.table.id': 'total_strikes_county',
}


## pull table from big query
table_data = sc.newAPIHadoopRDD(
    'com.google.cloud.hadoop.io.bigquery.JsonTextBigQueryInputFormat',
    'org.apache.hadoop.io.LongWritable',
    'com.google.gson.JsonObject',
    conf = conf)

# turn strings back into numbers
def To_numb(x):
  x['total_strikes'] = float(x['total_strikes'])
  x['area_land_meters'] = float(x['area_land_meters'])
  x['area_water_meters'] = float(x['area_water_meters'])
  return x


## convert table to a json like object
vals = table_data.values()
vals = vals.map(lambda line: json.loads(line))
vals = vals.map(To_numb)


##schema 
schema = StructType([
   StructField('geo_id', StringType(), True),
   StructField("county_name", StringType(), True),
   StructField("state_name", StringType(), True),
   StructField("total_strikes", FloatType(), True),
   StructField("area_land_meters", FloatType(), True),
   StructField("area_water_meters", FloatType(), True)])

## create a dataframe object
df1 = spark.createDataFrame(vals, schema = schema)

df1.repartition(4) 

# creates a column with lightning strikes per square mile
df1 = df1.withColumn('strikes_sqmile', col('total_strikes')/((col('area_land_meters') + col('area_water_meters'))/2590000))
pprint.pprint(df1.take(5))

## sorts counties by lightning strike density
df1.createOrReplaceTempView('lightning')
top = spark.sql("SELECT geo_id, county_name, state_name, strikes_sqmile FROM lightning ORDER BY strikes_sqmile desc LIMIT 10")
top = top.rdd.map(tuple)
pprint.pprint(top.collect())


## deletes the temporary files
input_path = sc._jvm.org.apache.hadoop.fs.Path(input_directory)
input_path.getFileSystem(sc._jsc.hadoopConfiguration()).delete(input_path, True)

