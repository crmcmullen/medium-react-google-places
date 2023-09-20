import React, { useState, useMemo, useEffect, useCallback } from "react";

import { _MAP_CENTER_FR_ } from './config';

const matchingCoordinates = (coordinates1, coordinates2) => (
  coordinates1.lat.toString() === coordinates2.lat.toString() &&
  coordinates1.lng.toString() === coordinates2.lng.toString()
);

const markerCoordinates = marker => JSON.parse(JSON.stringify(marker.getPosition()));

const _POLYGON_DATA_ = {
  //paths: [new window.google.maps.Marker(center)],
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.35,
  editable: false,
  // strokeColor: "#FF0000",
  // fillColor: "#FF0000",
};

const Map = ({ center, activePan = 0, pans = [], setSurface }) => {

  const [ map, setMap ] = useState();
  const [ markers, setMarkers ] = useState([]);
  
  const colorPan = useMemo(() => pans[activePan]?.color, [ pans, activePan ]);
  const getNewPolygon = () => new window.google.maps.Polygon({
    ..._POLYGON_DATA_,
    fillColor: colorPan, strokeColor: colorPan,
    editable: true,
  });

  const [ polygons, setPolygons ] = useState([
    getNewPolygon()
  ]);

  useEffect(() => {
    const colors = pans.map(p => p.color);
    if (colors.length < polygons.length) {
      console.log("Filtering based on colors ! polygons before=", polygons.length, " and color : ", colors);
      setPolygons(pols => pols.filter(p => {
        console.log(">> fillColor : ", p.fillColor);
        const isIncluded = colors.includes(p.fillColor);
        if (!isIncluded) {
          console.log(">> setting map to null for p=", p);
          // p.remove();
          p.setMap(null);
        }
        return isIncluded;
      }));
      console.log(">> polygons after filter=", polygons.length);
    }
    else if (colors.length > polygons.length)
      console.log("pan being added should be handled in activePan useEffect already");
  }, [ pans ])

  const polygon = useMemo(() => {
    for (const p of polygons)
      p.setEditable(false);
    if (activePan < polygons.length) {
      polygons[activePan].setEditable(true);
      return polygons[activePan];
    }
    else {
      const newPolygon = getNewPolygon();
      setPolygons([ ...polygons, newPolygon ]);
      return newPolygon;
    }
  }, [activePan]);


  console.log("Rendering Map : ", { center, activePan, colorPan, polygons, polygon });


  /* 1st, (re)load map when center changes, zoom out if no search otherwise zoomed in */
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
      if (polygon)
        polygon.setMap(mapIni);
    }
    loadGoogleMaps();
  }, [ center ]);

  useEffect(() => {
    if (!polygon || typeof polygon.setMap !== 'function')
      return ;
    polygon.setMap(map);
    window.google.maps.event.addListener(polygon.getPaths(), 'set_at', function(){
      // Point was created
      recalculateSurface();
    });

  }, [ polygon ])

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
    // console.log("In handleClickPoints ! ", { latLng, nbMarkers: markersIni.length });
    // // markersIni.forEach((marker, index) => 
    // //   console.log("Looping over marker[", index ,"] position=", markerCoordinates(marker))
    // // );
    // // const pinWithColor = new window.google.maps.marker.PinView({
    // //   background: colorPan,
    // // });


    // //If not already in array
    // if(!markersIni.some(marker => matchingCoordinates(markerCoordinates(marker), latLng))) {
    //   const newMarker = new window.google.maps.Marker({
    //   // const newMarker = new window.google.maps.marker.AdvancedMarkerView({
    //     position: latLng,
    //     map,
    //     // content: pinWithColor.element,
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
  }), [ map, polygon ])

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
    const listenerHandle = map.addListener("click", handleClickPoints);
    return () => window.google.maps.event.removeListener(listenerHandle);
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