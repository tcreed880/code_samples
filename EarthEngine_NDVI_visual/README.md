## NDVI Time Series and Seasonal Composites for Weld County, CO using Landsat and MODIS
To open in the Google Earth Engine console, click this link:
https://code.earthengine.google.com/9f881bc5c30825a8fce969f7b381b5a3?accept_repo=users%2Fstacemaples%2FSGC-EE101

This Google Earth Engine script analyzes vegetation dynamics in Weld County, Colorado, with a focus on the USDA Limited Irrigation Research Farm (LIRF). It performs two main tasks:

### Landsat 8 Time Series (Point Analysis):
Computes and plots a time series of NDVI values from 2018 to 2024 for the 30-meter Landsat pixel centered on LIRF.

### MODIS NDVI Seasonal Composite GIF (County-Scale Visualization):
Creates a seasonal NDVI GIF from 16-day MODIS composites across Weld County. Each frame represents the median NDVI for specific days of the year (e.g., Jan 1, Jan 17, Feb 2, etc.). A black square marker highlights the LIRF location.

To Use:
Open Google Earth Engine Code Editor, paste the script into a new GEE project and run to generate:
Run the script to generate:
1. An NDVI time series plot
2. A thumbnail animation (GIF) visualizing seasonal NDVI patterns in Weld County

Data Sources:
Landsat 8 TOA Reflectance: LANDSAT/LC08/C02/T1_TOA
MODIS NDVI (16-day composite): MODIS/006/MOD13A2
County Boundaries: TIGER/2018/Counties
