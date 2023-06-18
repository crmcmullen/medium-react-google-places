import React, { useState } from "react";
import "./home.scss";

import Form from './Form';
import Map from './Map';

import { _MAP_CENTER_FR_ } from './config';

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