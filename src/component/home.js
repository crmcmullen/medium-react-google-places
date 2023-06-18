import React, { useState } from "react";
import "./home.scss";

import Form from './Form';
import Map from './Map';

const _MAP_CENTER_FR_ = { lat: 47.01, lng: 2.618787 } // reducing lat a bit to have the bottom bigger for legend

function Home() {
  const [ center, setCenter ] = useState(_MAP_CENTER_FR_);


  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
      <Form centerMap={setCenter} />
      <Map center={center} />
    </div>
  );
}

export default Home;