NDVI Time Series and Seasonal Composites for Weld County, CO
This project contains a Google Earth Engine script that analyzes vegetation dynamics in Weld County, Colorado using remote sensing data from Landsat 8 and MODIS.

Overview
The script performs two key analyses:

NDVI Time Series (2018–2024)
Extracts NDVI values from Landsat 8 imagery at a point of interest (LIRF - Limited Irrigation Research Farm in Weld County).

A time series plot is generated showing vegetation trends from 2018 through 2024.

MODIS NDVI Seasonal Cycle Animation

Uses MODIS 16-day NDVI composites (1 km resolution) from 2018–2024.

Produces a median NDVI composite for each 16-day period of the year across all years.

Renders an animated GIF of the seasonal NDVI cycle across Weld County.

Includes a visual marker indicating the LIRF location.

Key Features
NDVI calculated from Landsat 8 (B5 - NIR and B4 - Red)

MODIS data filtered and composited by Day-of-Year (DOY)

Marker overlay for geographic reference (LIRF location)

Visualization settings optimized for vegetation greenness

How to Use
Open Google Earth Engine Code Editor

Paste the script into a new GEE project.

Run the script to generate:

An NDVI time series chart

A thumbnail animation (GIF) visualizing seasonal NDVI patterns

Data Sources
Landsat 8 TOA Reflectance: LANDSAT/LC08/C02/T1_TOA

MODIS NDVI (16-day composite): MODIS/006/MOD13A2

County Boundaries: TIGER/2018/Counties
