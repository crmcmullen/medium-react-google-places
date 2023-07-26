import React, { useState } from "react";
import {
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { green, blue, red, orange } from '@mui/material/colors';

import "./home.scss";

import Form from './Form';
import Map from './Map';

import { _MAP_CENTER_FR_ } from './config';
const _COLORS_ = [ green[500], blue[500], red[500], orange[500] ];


function Home() {
  const [ activeStep, setActiveStep ] = useState(0);
  const [ center, setCenter ] = useState(_MAP_CENTER_FR_);
  const [ pans, setPans ] = useState([
    { color: _COLORS_[0], surface: 0 },
  ]);
  const [ activePan, setActivePan ] = useState(0);

  const addPan = () => {
    setPans([ ...pans, { color: _COLORS_.find(c => !pans.some(p => p?.color === c)), surface: 0 } ]);
    setActivePan(pans.length - 1);
  };

  const deletePan = index => {
    setPans(p => p.filter((item, i) => i !== index));
    if (activePan === index)
      setActivePan(0);
  }

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
              { pans.map((pan, index) =>
                <Paper style={{ background: '#f2f2f2', padding: '1.5em', margin: '1em 0'}} elevation={activePan === index ? 12 : 2} onClick={() => setActivePan(index)}>
                  <Typography variant='h6' style={{ display: 'flex', justifyContent: 'space-between'}} component='div'>
                    <div style={{ display: 'flex' }}>
                      <div style={{ backgroundColor: pan?.color, width: 30, height: 30 }}>{' '}</div>
                      Pan { index + 1}
                    </div>
                    <div style={{ display: 'flex' }}>
                      <IconButton onClick={() => deletePan(index)} disabled={pans.length === 1}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton onClick={addPan} disabled={pans.length === 4}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  </Typography>
                  <Typography>
                    Surface :
                    { pan.surface ? pan.surface.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '--'} m2
                  </Typography>
                </Paper>
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
