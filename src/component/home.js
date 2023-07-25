import React, { useState } from "react";
import {
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';

import "./home.scss";

import Form from './Form';
import Map from './Map';

import { _MAP_CENTER_FR_ } from './config';

function Home() {
  const [ center, setCenter ] = useState(_MAP_CENTER_FR_);
  const [ surface, setSurface ] = useState(0);
  const [ activeStep, setActiveStep ] = useState(0);

  const submitAddress = location => {
    setCenter(location);
    setActiveStep(1);
  }


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
                <Form centerMap={submitAddress} />        
              </StepContent>
            </Step>
            <Step>
              <StepLabel onClick={() => setActiveStep(1)}>Calculer les pans</StepLabel>
              <StepContent>
                <div style={{ background: '#f2f2f2', padding: '1.5em', margin: '1em 0'}}>
                  <h4>Surface : { surface ? surface.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '--'} m2</h4>
                </div>
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
          <Map center={center} setSurface={setSurface} />
        </Paper>
      </div>
    </div>
  );
}

export default Home;