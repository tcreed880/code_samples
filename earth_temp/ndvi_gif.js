// Creating a time series plot (2018-2024) of NDVI values from LandSat8 at the Limited Irrigation Research Farm (LIRF) in Weld County, CO

// Select the region of interest, center point at LIRF in Weld County, CO.
var roi = ee.Geometry.Point([-104.470861, 40.449111]);

// Load the Landsat8 image collection
var sat_image = ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA");

// Compute Normalized Differenced Vegetation Index and add as band
var NDVI_layer = function(layer) {
  var ndvi = layer.normalizedDifference(['B5', 'B4']).rename('NDVI');
  return layer.addBands(ndvi);
};

// Filters images by from 2018-2014, apply NDVI function to images
var timeSeriesNDVI = sat_image
  .filterBounds(roi)
  .filterDate('2018-01-01', '2024-12-31')
  .map(NDVI_layer);

// Plot NDVI values for the 30 meter pixel containing LIRF point of interest from 2018 - 2024 
var ts_ndvi = ui.Chart.image.series({
  imageCollection: timeSeriesNDVI.select('NDVI'),
  region: roi,
  reducer: ee.Reducer.first(),
  scale: 30
}).setOptions({
  title: 'NDVI at LIRF (2018–2024)',
  hAxis: { title: 'Time' },
  vAxis: {
    title: 'NDVI',
    viewWindow: {
      min: -0.25,
      max: 0.5
    }
  },
  series: { 0: { color: 'darkgreen' } }
});

print(ts_ndvi);



// Create a gif visualization of seasonal NDVI cycle across Weld County using MODIS composites from 2018-2024
// Add black box marker around LIRF

// Load Weld County geometry from Census data
var counties = ee.FeatureCollection("TIGER/2018/Counties");
var weld = counties.filter(ee.Filter.and(
  ee.Filter.eq('STATEFP', '08'),
  ee.Filter.eq('NAME', 'Weld')
)).geometry();

// Load MODIS NDVI for Weld County from 2018–2024. 16-day intervals, 1 km resolution
var modis_ndvi_all = ee.ImageCollection('MODIS/006/MOD13A2')
  .filterDate('2018-01-01', '2024-12-31')
  .filterBounds(weld)
  .select('NDVI')
  .map(function(img) {
    return img.clip(weld);
  });

// Create a reference date list for every 16 days to create composites
// This method will show what NDVI typically looks like on the 16th, 32nd,... day of the year
var doy_list = ee.List.sequence(0, 352, 16);
var ref_doys = ee.ImageCollection(doy_list.map(function(doy) {
  return ee.Image().set({
    'doy': doy,
    'system:time_start': ee.Date('2023-01-01').advance(doy, 'day').millis()
  });
}));

// Get day of year number for each image
var ndvi_with_doy = modis_ndvi_all.map(function(img) {
  var doy = ee.Date(img.get('system:time_start')).getRelative('day', 'year');
  return img.set('doy', doy);
});

// Join MODIS images together based on day of year list
var doy_filter = ee.Filter.equals({leftField: 'doy', rightField: 'doy'});
var join = ee.Join.saveAll('doy_matches');
var joined = ee.ImageCollection(join.apply(ref_doys, ndvi_with_doy, doy_filter));

// Create median composite pixel for each day of year group
var composites = joined.map(function(img) {
  var group = ee.ImageCollection.fromImages(img.get('doy_matches'));
  return group.median()
    .clip(weld)
    .set('system:time_start', img.get('system:time_start'));
});

// Set the color and scale parameters for NDVI in the image
var visParams = {
  min: 0.0,
  max: 9000.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ]
};

// Create a marker on LIRF (small black square)
var marker_outline = ee.Image().byte().paint({
  featureCollection: ee.FeatureCollection([ee.Feature(roi.buffer(1000).bounds())]),
  color: 1,
  width: 2  
}).visualize({
  palette: ['000000'],
  forceRgbOutput: true,
  opacity: 1
});

// Visualize each NDVI composite, add LIRF marker
var rgbVis = composites.map(function(img) {
  return img.visualize(visParams).clip(weld)
    .blend(marker_outline)
    .set('system:time_start', img.get('system:time_start'));
});

// Set the gif parameters
var gifParams = {
  region: weld,
  dimensions: 800,
  crs: 'EPSG:3857',
  framesPerSecond: 5
};

// Render the GIF in console
print('MODIS NDVI seasonal cycle across Weld County');
print(ui.Thumbnail(rgbVis, gifParams));

