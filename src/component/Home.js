import React, { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';

import { green, blue, red, orange } from '@mui/material/colors';
import "./home.scss";

import AddressForm from './AddressForm';
import PanelCalculation from './PanelCalculation';
import Map from './Map';

import { _MAP_CENTER_FR_ } from './config';

const _COLORS_ = [ green[500], blue[500], red[500], orange[500] ];

function Home() {
  const [ activeStep, setActiveStep ] = useState(0);

  const addressForm = useForm({});


  const [ center, setCenter ] = useState(_MAP_CENTER_FR_);
  const [ pans, setPans ] = useState([
    { nb: 1, color: _COLORS_[0], surface: 0 },
  ]);
  const [ activePan, setActivePan ] = useState(0);

  const addPan = () => {
    setPans([
      ...pans,
      {
        color: _COLORS_.find(c => !pans.some(p => p?.color === c)),
        surface: 0,
        nb: pans.length + 1,
      }
    ]);
    setActivePan(pans.length - 1);
  };

  const deletePan = index => {
    setPans(p => p.filter((item, i) => i !== index));
    if (activePan === index)
      setActivePan(0);
  };

  const submitAddress = location => {
    setCenter(location);
    setActiveStep(1);
  };


  return (
    <div className="container">
      <Typography variant='h5' color='primary' gutterBottom>
        Calculer rendement solaire
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
        <Paper style={{ width: '100%', padding: '1rem' }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel onClick={() => setActiveStep(0)}>Renseigner l'adresse</StepLabel>
              <StepContent>
                <AddressForm { ...addressForm } centerMap={submitAddress} />        
              </StepContent>
            </Step>
            <Step>
              <StepLabel onClick={() => setActiveStep(1)}>Calculer les pans</StepLabel>
              <StepContent>
              { pans.map((pan, index) =>
                <PanelCalculation
                  key={index}
                  pan={pan}
                  addPan={addPan}
                  isActive={activePan === index}
                  setActivePan={() => setActivePan(index)}
                  deletePan={() => deletePan(index)}
                  nbPans={pans.length}
                />
              ) }
              </StepContent>
            </Step>
            <Step onClick={() => setActiveStep(2)}>
              <StepLabel>Enlever les obstacles</StepLabel>
              <StepContent>
                A DEFINIR
              </StepContent>
            </Step>
            <Step onClick={() => setActiveStep(3)}>
              <StepLabel>Indiquer l'inclinaison</StepLabel>
              <StepContent>
                A DEFINIR
              </StepContent>
            </Step>
            <Step onClick={() => setActiveStep(4)}>
              <StepLabel>Retour météo</StepLabel>
              <StepContent>
                A DEFINIR
              </StepContent>
            </Step>
            <Step onClick={() => setActiveStep(5)}>
              <StepLabel>Résultat</StepLabel>
              <StepContent>
                A DEFINIR
              </StepContent>
            </Step>
          </Stepper>
        </Paper>
        <Paper>
          <Map
            center={center}
            setSurface={surface => setPans(ps =>
              ps.map((pan, index) => 
                index === activePan
                ? ({ ...pan, surface })
                : pan
              )
            )}
            activePan={activePan}
            pans={pans}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Home;
