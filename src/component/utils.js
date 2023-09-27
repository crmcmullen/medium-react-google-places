
const rectangleSize = {
  width: 1,
  height: 2,
};

// Earth's radius in meters
const earthRadius = 6371000;

// Convert degrees to radians
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Calculate the distance in meters between two LatLng points
// const calculateDistance = (latLng1, latLng2) => {
//   const dLat = degreesToRadians(latLng2.lat() - latLng1.lat());
//   const dLng = degreesToRadians(latLng2.lng() - latLng1.lng());

//   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(degreesToRadians(latLng1.lat())) * Math.cos(degreesToRadians(latLng2.lat())) *
//     Math.sin(dLng / 2) * Math.sin(dLng / 2);

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return earthRadius * c;
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

  // const numRows = Math.floor(height / rectangleSize.height);
  // const numCols = Math.floor(width / rectangleSize.width);
  // // Convert meters to degrees for latitude and longitude
  // const latitudePerMeter = 1 / (earthRadius * (Math.PI / 180));
  // const longitudePerMeter = 1 / (earthRadius * Math.cos(degreesToRadians(bounds.getCenter().lat())) * (Math.PI / 180));

  // for (let i = 0; i < numRows; i++) {
  //   for (let j = 0; j < numCols; j++) {
  //     const rectCoords = [
  //       {
  //         lat: bounds.getSouthWest().lat() + i * rectangleSize.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + j * rectangleSize.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + i * rectangleSize.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + (j + 1) * rectangleSize.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + (i + 1) * rectangleSize.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + (j + 1) * rectangleSize.width * longitudePerMeter,
  //       },
  //       {
  //         lat: bounds.getSouthWest().lat() + (i + 1) * rectangleSize.height * latitudePerMeter,
  //         lng: bounds.getSouthWest().lng() + j * rectangleSize.width * longitudePerMeter,
  //       },
  //     ];
  //     rectangles.push(rectCoords)

  //   }
  // }

function isPolygonInsidePolygon(innerPolygon, outerPolygon) {
  // Iterate through the vertices of the inner polygon
  for (const vertex of innerPolygon) {
    // Check if each vertex is inside the outer polygon
    if (!window.google.maps.geometry.poly.containsLocation(new window.google.maps.LatLng(vertex), new window.google.maps.Polygon({path: outerPolygon}) )) {
      return false; // If any vertex is outside, the inner polygon is not fully inside
    }
  }
  return true; // All vertices of the inner polygon are inside the outer polygon
}

const fillShapeWithRectangles = ({path}) => {

  let rectangles =[];
  // Calculate the bounding box of the parent polygon
  const bounds = new window.google.maps.LatLngBounds();
  for (const latLng of path) {
    bounds.extend(latLng);
  }

  // Calculate the size of each rectangle
  const rectangleWidth = rectangleSize.width;
  const rectangleHeight = rectangleSize.height;

  // Determine the number of rows and columns of rectangles
  // Calculate the dimensions of the parent polygon in meters
  const boundsWidthMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng()),
    new window.google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getNorthEast().lng())
  );
  const boundsHeightMeters = window.google.maps.geometry.spherical.computeDistanceBetween(
    new window.google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng()),
    new window.google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getSouthWest().lng())
  );

  // Determine the number of rows and columns of rectangles based on the dimensions in meters
  const numRows = Math.floor(boundsHeightMeters / rectangleHeight);
  const numCols = Math.floor(boundsWidthMeters / rectangleWidth);

  // // Convert meters to degrees for latitude and longitude
  const latitudePerMeter = 1 / (earthRadius * (Math.PI / 180));
  const longitudePerMeter = 1 / (earthRadius * Math.cos(degreesToRadians(bounds.getCenter().lat())) * (Math.PI / 180));
  // console.log({numRows,numCols})
  // Iterate through rows and columns to generate rectangles
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {

      // Create a rectangle polygon from the coordinates
      const rectanglePolygon = [
        {
          lat: bounds.getSouthWest().lat() + i * rectangleSize.height * latitudePerMeter,
          lng: bounds.getSouthWest().lng() + j * rectangleSize.width * longitudePerMeter,
        },
        {
          lat: bounds.getSouthWest().lat() + i * rectangleSize.height * latitudePerMeter,
          lng: bounds.getSouthWest().lng() + (j + 1) * rectangleSize.width * longitudePerMeter,
        },
        {
          lat: bounds.getSouthWest().lat() + (i + 1) * rectangleSize.height * latitudePerMeter,
          lng: bounds.getSouthWest().lng() + (j + 1) * rectangleSize.width * longitudePerMeter,
        },
        {
          lat: bounds.getSouthWest().lat() + (i + 1) * rectangleSize.height * latitudePerMeter,
          lng: bounds.getSouthWest().lng() + j * rectangleSize.width * longitudePerMeter,
        },
      ];
      // console.log(isPolygonInsidePolygon(rectanglePolygon, path))
      // Check if the rectangle is completely contained within the parent polygon
      if (isPolygonInsidePolygon(rectanglePolygon, path)) {
        rectangles.push(rectanglePolygon);
      }
    }
  }
  return rectangles;
}

export { fillShapeWithRectangles };