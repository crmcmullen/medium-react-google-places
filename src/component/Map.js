import React, { useEffect, useRef, useState } from "react";

const Map = ({ center }) => {
  const [clickedPoints, setClickedPoints] = useState([]);

  useEffect(() => {
    async function loadGoogleMaps() {
      // The map, centered from props
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center,
      });
      // The marker, positioned at the center of the map
      const marker = new window.google.maps.Marker({
        position: center,
        map: map,
      });
      clickedPoints.map( cP => new window.google.maps.Marker({
        position: cP,
        map: map,
      }));
      map.addListener("click", (e) => {
        console.log('Cleikc on map',e)
        handleClickedPoints(e)
      });

    }
    loadGoogleMaps();
  }, [ center, clickedPoints ]);

  const compareCoordinates = (coordinates1, coordinates2) => coordinates1.lat.toString() === coordinates2.lat.toString() && coordinates1.lng.toString() === coordinates2.lng.toString();
  const handleClickedPoints = (e) =>{
    const latLng = JSON.parse(JSON.stringify(e.latLng));
    //If not already in array
    if(clickedPoints.filter(cP => compareCoordinates(cP, latLng)).length === 0)
      setClickedPoints(cP => [...cP,latLng])
    else // If in array we remove it
      setClickedPoints(cP => {
        let tempArray = cP;
        tempArray.splice(tempArray.findIndex(point => compareCoordinates(point,latLng)),1);
        return tempArray;
      })
  }
  useEffect(() => {
    console.log('in UEF')
    if(clickedPoints.length > 2)
      console.log('Surface found', window.google.maps.geometry.spherical.computeArea(clickedPoints));
  }, [clickedPoints]);
  // useEffect(() => {

  // }. [ center ])


  return (
    <div id="map" style={{ width: '40vw', height: '90vh' }}/>
  )
}

export default Map;