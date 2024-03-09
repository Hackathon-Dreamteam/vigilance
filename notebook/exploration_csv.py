# Databricks notebook source
import pandas as pd

# COMMAND ----------

pd_df = pd.read_csv("inaturalist_data.csv", header=0)

# COMMAND ----------

df = spark.createDataFrame(pd_df)

# COMMAND ----------

from pyspark.sql.functions import schema_of_json, col
taxon_schema = df.select(schema_of_json(col("taxon"))).collect()

# COMMAND ----------


