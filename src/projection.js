import proj4 from "proj4";

// WGS-84 (EPSG: 4326)
const epsg4326 =
  'GEOGCS["WGS 84",' +
  'DATUM["WGS_1984",' +
  'SPHEROID["WGS 84",6378137,298.257223563,' +
  'AUTHORITY["EPSG","7030"]],' +
  'AUTHORITY["EPSG","6326"]],' +
  'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],' +
  'UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],' +
  'AUTHORITY["EPSG","4326"]]';

// // USGS National Albers (EPSG: 5070)
// const epsg5070 =
//   'PROJCS["NAD83 / Conus Albers",' +
//   'GEOGCS["NAD83", DATUM["North_American_Datum_1983",' +
//   'SPHEROID["GRS 1980",6378137,298.257222101,' +
//   'AUTHORITY["EPSG","7019"]],' +
//   "TOWGS84[0,0,0,0,0,0,0]," +
//   'AUTHORITY["EPSG","6269"]],' +
//   'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],' +
//   'UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],' +
//   'AUTHORITY["EPSG","4269"]],' +
//   'PROJECTION["Albers_Conic_Equal_Area"],' +
//   'PARAMETER["standard_parallel_1",29.5],' +
//   'PARAMETER["standard_parallel_2",45.5],' +
//   'PARAMETER["latitude_of_center",23],' +
//   'PARAMETER["longitude_of_center",-96],' +
//   'PARAMETER["false_easting",0],' +
//   'PARAMETER["false_northing",0],' +
//   'UNIT["metre",1,AUTHORITY["EPSG","9001"]],' +
//   'AXIS["X",EAST],' +
//   'AXIS["Y",NORTH],' +
//   'AUTHORITY["EPSG","5070"]]';

// Web mercator (tile projection)
const epsg3785 =
  'PROJCS["Popular Visualisation CRS / Mercator (deprecated)",' +
  'GEOGCS["Popular Visualisation CRS",' +
  'DATUM["Popular_Visualisation_Datum",' +
  'SPHEROID["Popular Visualisation Sphere",6378137,0,' +
  'AUTHORITY["EPSG","7059"]],' +
  "TOWGS84[0,0,0,0,0,0,0]," +
  'AUTHORITY["EPSG","6055"]],' +
  'PRIMEM["Greenwich",0,' +
  'AUTHORITY["EPSG","8901"]],' +
  'UNIT["degree",0.0174532925199433,' +
  'AUTHORITY["EPSG","9122"]],' +
  'AUTHORITY["EPSG","4055"]],' +
  'PROJECTION["Mercator_1SP"],' +
  'PARAMETER["central_meridian",0],' +
  'PARAMETER["scale_factor",1],' +
  'PARAMETER["false_easting",0],' +
  'PARAMETER["false_northing",0],' +
  'UNIT["metre",1,' +
  'AUTHORITY["EPSG","9001"]],' +
  'AXIS["X",EAST],' +
  'AXIS["Y",NORTH],' +
  'EXTENSION["PROJ4","+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext +no_defs"],' +
  'AUTHORITY["EPSG","3785"]]';

export function projectPoint(lng, lat) {
  // return proj4(epsg4326, epsg5070, [lng, lat]);
  return proj4(epsg4326, epsg3785, [lng, lat]);
}
