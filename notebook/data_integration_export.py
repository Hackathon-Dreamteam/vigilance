# Databricks notebook source
import pandas as pd
import numpy as np

# COMMAND ----------

df_sentinelle = pd.read_csv('data/input/sentinelle_liste_sp.csv', header=0)
df_naturalist = pd.read_csv("data/input/observations-laval.csv", header=0)
df_naturalist["location"] = "Laval"

# COMMAND ----------

display(df_naturalist)

# COMMAND ----------

def add_isInvasive_column(df_inaturalist, df_sentinelle):
    cols_to_return = list(df_inaturalist)
    cols_to_return.append("isInvasive")
    df_inaturalist['species_guess'] = df_inaturalist[['species_guess']].apply(lambda x: x.astype(str).str.lower())
    df_sentinelle["Nom_francais"] = df_sentinelle[['Nom_francais']].apply(lambda x: x.astype(str).str.lower())
    merged_df = df_inaturalist.merge(right=df_sentinelle, left_on='species_guess', right_on='Nom_francais', how='left')
    merged_df["isInvasive"] = np.where((merged_df["Nom_francais"].isnull()) | (merged_df["Nom_francais"] == np.nan), False, True)
    return merged_df[cols_to_return]

# COMMAND ----------

def get_community_observations_df(df_naturalist, df_sentinelle):
    df = df_naturalist.copy()
    df["id"] = "c_" + df["id"].astype(str)
    df.rename(columns={'observed_on': 'observation_date'}, inplace=True)
    df['species_guess'] = df['common_name'].astype(str).str.lower()
    df = add_isInvasive_column(df, df_sentinelle)
    df["source"] = "Community"
    df["image_url"] = df['image_url'].replace("square.jpeg", "large.jpeg").replace("medium.jpeg", "large.jpeg")
    df = df[['id', 'species_guess', 'location', 'observation_date', 'isInvasive', 'latitude', 'longitude', 'source', 'image_url']]
    return df

# COMMAND ----------


community_df = get_community_observations_df(df_naturalist, df_sentinelle)

# COMMAND ----------

display(community_df)

# COMMAND ----------


