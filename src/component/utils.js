
const _RECTANGLE_SIZE_ = {
  width: 1,
  height: 2,
};

// Earth's radius in meters
const _EARTH_RADIUS_ = 6371000;
const latitudePerMeter = 1 / (_EARTH_RADIUS_ * (Math.PI / 180));

// Convert degrees to radians
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

function getLongitudePerMeter(lat){
  return (
    1 / (
      _EARTH_RADIUS_ *
      Math.cos(degreesToRadians(lat)) *
      Math.PI / 180
    )
  );
}

// Calculate the distance in meters between two LatLng points
// const calculateDistance = (latLng1, latLng2) => {
//   const dLat = degreesToRadians(latLng2.lat() - latLng1.lat());
//   const dLng = degreesToRadians(latLng2.lng() - latLng1.lng());

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(degreesToRadians(latLng1.lat())) * Math.cos(degreesToRadians(latLng2.lat())) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return _EARTH_RADIUS_ * c;
// };
/**
 * Keep it might need it later for the heading we will see
 */
  // if(path.length < 3)
  //   return [];
  // let rectangles = [];

  // const bounds = new window.google.maps.LatLngBounds();
  // for (const latLng of path) {
  //   bounds.extend(latLng);
  // }
  // const heading = window.google.maps.geometry.spherical.computeHeading(new window.google.maps.LatLng(path[0]), new window.google.maps.LatLng(path[1]));

  // const southwest = bounds.getSouthWest();
  // const northeast = bounds.getNorthEast();

  // const width = calculateDistance(southwest, new window.google.maps.LatLng(southwest.lat(), northeast.lng()));
  // const height = calculateDistance(southwest, new window.google.maps.LatLng(northeast.lat(), southwest.lng()));

  // const numRows = Math.floor(height / _RECTANGLE_SIZE_.height);
  // const numCols = Math.floor(width / _RECTANGLE_SIZE_.width);
  // // Convert meters to degrees for latitude and longitude
  // const latitudePerMeter = 1 / (_EARTH_RADIUS_ * (Math.PI / 180));
  // const longitudePerMeter = 1 / (_EARTH_RADIUS_ * Math.cos(degreesToRadians(bounds.getCenter().lat())) * (Math.PI / 180));

  // for (let i = 0; i < numRows; i++) {
  //   for (let j = 0; j < numCols; j++) {
  //     const rectCoords = [
  //       {
  //         lat: bounds.getSouthWest().lat() + i * _RECTANGLE_SIZE_.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + j * _RECTANGLE_SIZE_.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + i * _RECTANGLE_SIZE_.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + (j + 1) * _RECTANGLE_SIZE_.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + (i + 1) * _RECTANGLE_SIZE_.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + (j + 1) * _RECTANGLE_SIZE_.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + (i + 1) * _RECTANGLE_SIZE_.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + j * _RECTANGLE_SIZE_.width * longitudePerMeter,
  //       },
  //     ];
  //     rectangles.push(rectCoords)

  //   }
  // }

// Check if the rectangle is completely contained within the parent polygon
function isPolygonInsidePolygon(innerPolygon, outerPolygon) {
  // Iterate through the vertices of the inner polygon
  for (const vertex of innerPolygon) {
    // Check if each vertex is inside the outer polygon
    if (!window.google.maps.geometry.poly.containsLocation(
      new window.google.maps.LatLng(vertex),
      new window.google.maps.Polygon({path: outerPolygon})
    )) {
      return false; // If any vertex is outside, the inner polygon is not fully inside
    }
  }
  return true; // All vertices of the inner polygon are inside the outer polygon
}

// Create a rectangle polygon from the coordinates
function createRectanglePolygon({ numRow, numCol, southWestLat, soutWestLng, _RECTANGLE_SIZE_, longitudePerMeter }) {
  return [
    {
      lat: southWestLat + numRow * _RECTANGLE_SIZE_.height * latitudePerMeter,
      lng: soutWestLng + numCol * _RECTANGLE_SIZE_.width * longitudePerMeter,
    },
    {
      lat: southWestLat + numRow * _RECTANGLE_SIZE_.height * latitudePerMeter,
      lng: soutWestLng + (numCol + 1) * _RECTANGLE_SIZE_.width * longitudePerMeter,
    },
    {
      lat: southWestLat + (numRow + 1) * _RECTANGLE_SIZE_.height * latitudePerMeter,
      lng: soutWestLng + (numCol + 1) * _RECTANGLE_SIZE_.width * longitudePerMeter,
    },
    {
      lat: southWestLat + (numRow + 1) * _RECTANGLE_SIZE_.height * latitudePerMeter,
      lng: soutWestLng + numCol * _RECTANGLE_SIZE_.width * longitudePerMeter,
    },
  ];
}

/**
 * We use "bounds" that will draw a rectangle around the polygon of the Pan
 * From the extremities we iterate to create polygons (one solar panel)
 * And check if each child polygon fits in the main pan
 * By iterating on cols/rows depending on the solar panel size, we draw the grid
 * 
**/


const fillShapeWithRectangles = ({path}) => {

  let rectangles =[];
  // Calculate the bounding box of the parent polygon
  const bounds = new window.google.maps.LatLngBounds();
  for (const latLng of path) {
    bounds.extend(latLng);
  }

  // Calculate the size of each rectangle
  const rectangleWidth = _RECTANGLE_SIZE_.width;
  const rectangleHeight = _RECTANGLE_SIZE_.height;

  // we also use northEast lat/lng but these ones are called multiple time
  const southWestLat = bounds.getSouthWest().lat();
  const soutWestLng = bounds.getSouthWest().lng();

  // Determine the number of rows and columns of rectangles
  // Calculate the dimensions of the parent polygon in meters
  const boundsWidthMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(southWestLat, soutWestLng),
    new window.google.maps.LatLng(southWestLat, bounds.getNorthEast().lng())
  );
  const boundsHeightMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(southWestLat, soutWestLng),
    new window.google.maps.LatLng(bounds.getNorthEast().lat(), soutWestLng)
  );

  // Determine the number of rows and columns of rectangles based on the dimensions in meters
  const numRows = Math.floor(boundsHeightMeters / rectangleHeight);
  const numCols = Math.floor(boundsWidthMeters / rectangleWidth);

  // // Convert meters to degrees for latitude and longitude
  const longitudePerMeter = getLongitudePerMeter(bounds.getCenter().lat());

  // console.log({numRows,numCols})
  // Iterate through rows and columns to generate rectangles
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      // console.log(isPolygonInsidePolygon(rectanglePolygon, path))
      // Create a rectangle polygon from the coordinates
      const rectanglePolygon = createRectanglePolygon({
        numRow: i, numCol: j,
        southWestLat, soutWestLng,
        _RECTANGLE_SIZE_,
        latitudePerMeter, longitudePerMeter,
      });
      // Check if the rectangle is completely contained within the parent polygon
      if (isPolygonInsidePolygon(rectanglePolygon, path))
        rectangles.push(rectanglePolygon);
    }
  }
  return rectangles;
}

export { fillShapeWithRectangles };