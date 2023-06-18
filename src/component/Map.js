import React, { useEffect, useRef } from "react";

const Map = ({ center }) => {
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

    }
    loadGoogleMaps();
  }, [ center ]);

  // useEffect(() => {

  // }. [ center ])


  return (
    <div id="map" style={{ width: '40vw', height: '90vh' }}/>
  )
}

export default Map;