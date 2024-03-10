# Databricks notebook source
import pandas as pd 
df = pd.read_json("observations.json")
spark.createDataFrame(df).createOrReplaceTempView("observations")

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT
# MAGIC     location,
# MAGIC     species_guess,
# MAGIC     year(observation_date) as observation_year,
# MAGIC     weekofyear(observation_date) as observation_week,
# MAGIC     count(*) as count_observations
# MAGIC FROM
# MAGIC     observations
# MAGIC WHERE
# MAGIC     -- IsInvasive = "true" and
# MAGIC     location = 'Montreal'
# MAGIC GROUP BY
# MAGIC     location,
# MAGIC     species_guess,
# MAGIC     observation_year,
# MAGIC     observation_week
# MAGIC ORDER BY
# MAGIC     observation_year DESC,
# MAGIC     observation_week DESC

# COMMAND ----------


