import proj4 from "proj4";

// WGS-84 (EPSG: 4326)
const epsg_4326 = 'GEOGCS["WGS 84",'
  + 'DATUM["WGS_1984",'
  + 'SPHEROID["WGS 84",6378137,298.257223563,'
  + 'AUTHORITY["EPSG","7030"]],'
  + 'AUTHORITY["EPSG","6326"]],'
  + 'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],'
  + 'UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],'
  + 'AUTHORITY["EPSG","4326"]]';

// USGS National Albers (EPSG: 5070)
const epsg_5070 = 'PROJCS["NAD83 / Conus Albers",'
  + 'GEOGCS["NAD83", DATUM["North_American_Datum_1983",'
  + 'SPHEROID["GRS 1980",6378137,298.257222101,'
  + 'AUTHORITY["EPSG","7019"]],'
  + 'TOWGS84[0,0,0,0,0,0,0],'
  + 'AUTHORITY["EPSG","6269"]],'
  + 'PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],'
  + 'UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],'
  + 'AUTHORITY["EPSG","4269"]],'
  + 'PROJECTION["Albers_Conic_Equal_Area"],'
  + 'PARAMETER["standard_parallel_1",29.5],'
  + 'PARAMETER["standard_parallel_2",45.5],'
  + 'PARAMETER["latitude_of_center",23],'
  + 'PARAMETER["longitude_of_center",-96],'
  + 'PARAMETER["false_easting",0],'
  + 'PARAMETER["false_northing",0],'
  + 'UNIT["metre",1,AUTHORITY["EPSG","9001"]],'
  + 'AXIS["X",EAST],'
  + 'AXIS["Y",NORTH],'
  + 'AUTHORITY["EPSG","5070"]]';

export function project_point(lng, lat) {
  return proj4(epsg_4326, epsg_5070, [lng, lat]);
}


  
  