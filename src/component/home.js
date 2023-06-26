import React, { useState } from "react";
import "./home.scss";

import Form from './Form';
import Map from './Map';

import { _MAP_CENTER_FR_ } from './config';

function Home() {
  const [ center, setCenter ] = useState(_MAP_CENTER_FR_);
  const [ surface, setSurface ] = useState(0);

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
      <div>
        <Form centerMap={setCenter} />
        <div style={{ background: '#f2f2f2', padding: '1.5em', margin: '1em 0'}}>
          <h4>Surface : { surface ? surface.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '--'} m2</h4>
        </div>
      </div>
      <Map center={center} setSurface={setSurface} />
    </div>
  );
}

export default Home;