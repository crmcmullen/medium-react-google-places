import React, { useState, useEffect, useCallback } from "react";

import { _MAP_CENTER_FR_ } from './config';

const matchingCoordinates = (coordinates1, coordinates2) => (
  coordinates1.lat.toString() === coordinates2.lat.toString() &&
  coordinates1.lng.toString() === coordinates2.lng.toString()
);


const markerCoordinates = marker => JSON.parse(JSON.stringify(marker.getPosition()));

const Map = ({ center, setSurface }) => {
  const [ map, setMap ] = useState();
  const [ markers, setMarkers ] = useState([]);
  
  const [ polygon, setPolygon ] = useState(new window.google.maps.Polygon({
    //paths: [new window.google.maps.Marker(center)],
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
    editable: true,
  }));

  /* 1st, (re)load map when center changes */
  useEffect(() => {
    async function loadGoogleMaps() {
      const isFranceCenter = matchingCoordinates(center, _MAP_CENTER_FR_);

      const mapIni = new window.google.maps.Map(document.getElementById("map"), {
        zoom: isFranceCenter ? 6 : 20,
        center,
        mapTypeId: "satellite"
      })
      // The map, centered from props
      setMap(mapIni);
      setMarkers([]);
      polygon.setMap(mapIni);
    }
    loadGoogleMaps();
  }, [ center ]);

  window.google.maps.event.addListener(polygon.getPaths(), 'set_at', function(){
    // Point was created
    recalculateSurface();
  });

  /* handler function on click to put the marker */
  const handleClickPoints = useCallback((e) => setMarkers(markersIni => {
    const latLng = JSON.parse(JSON.stringify(e.latLng));
    // console.log("In handleClickPoints ! ", { latLng, nbMarkers: markersIni.length });
    // // markersIni.forEach((marker, index) => 
    // //   console.log("Looping over marker[", index ,"] position=", markerCoordinates(marker))
    // // );

    // //If not already in array
    // if(!markersIni.some(marker => matchingCoordinates(markerCoordinates(marker), latLng))) {
    //   const newMarker = new window.google.maps.Marker({
    //     position: latLng,
    //     map,
    //   });
    //   newMarker.addListener("click", handleClickPoints)
    //   console.log("Adding marker : ", markerCoordinates(newMarker));
    //   return [ ...markersIni, newMarker ];
    // }
    // else { // If in array we remove it
    //   console.log("Should removed existing marker");
    //   let tempArray = [ ...markersIni ];
    //   const oldMarker = tempArray.splice(
    //     tempArray.findIndex(marker => matchingCoordinates(markerCoordinates(marker),latLng)),
    //     1
    //   )[0];
    //   oldMarker.setMap(null);
    //   return tempArray;
    // }
    const path = polygon.getPath()?.g; // g for array of position
    console.log('handleClickPoints', {latLng, path})
    polygon.setPath([...path, latLng]);
    //setMarkers(path.map(p => ({lat: p.lat(), lng: p.lng()})));
  }), [ map ])

  // useEffect(() => { 
  //   // Update polygon path
  //   setPolygon(() => {
  //     polygon.setPath(markers.map(m => markerCoordinates(m)))
  //     return polygon;
  //   });
  // }, [markers])

  /* after ini, put marker for center, and set click listener */
  useEffect (() => {
    if (!map)
      return ;

    // const centerMarker = new window.google.maps.marker.PinView({
    //   background: '#FBBC04',
    // })

    // The marker, positioned at the center of the map
    /*const marker = */
    new window.google.maps.Marker({
      position: center,
      map,
      // content: centerMarker.elementm
    });
    // setMarkers([ marker ]);
    map.addListener("click", handleClickPoints);
  }, [ center, map, handleClickPoints ])

  /* on points change, draw the markers, and calc surface if needed*/ 
  const recalculateSurface = () => {
    // console.log("useEffect calc surface if more than 2 markers");
    const path = polygon.getPath()?.g;
    console.log(path, 'path')
    if (path.length > 2) {
      const surface = window.google.maps.geometry?.spherical?.computeArea(path.map(p => ({lat: p.lat(), lng: p.lng()}))/* .map(m => markerCoordinates(m)) */);
      // alert('Surface found : ' + surface);
      setSurface(surface);
    }
  }

  return (
    <div id="map" style={{ width: '40vw', height: '90vh' }}/>
  )
}

export default Map;