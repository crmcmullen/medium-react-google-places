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

  const [ panelsState, setPanelsState ] = useState({
    pans: [
     { nb: 1, color: _COLORS_[0], surface: 0 },
    ],
    activePan: 0
  });
  const {
    pans = [],
    activePan = 0,
  } = panelsState;

  const setActivePan = index => evt => {
    evt.preventDefault();
    evt.stopPropagation();
    setPanelsState(s => ({ ...s, activePan: index }) );
  }

  const addPan = evt => {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("In addPan !");
    setPanelsState(s => {
      const newPans = {
        pans: [
          ...s.pans,
          {
            color: _COLORS_.find(c => !s.pans.some(p => p?.color === c)),
            surface: 0,
            nb: s.pans.length + 1,
          }
        ],
        activePan: s.pans.length, // since new index is old size
      };
      console.log(">> newPans : ", newPans);
      return newPans;
    });
  };

  const deletePan = index => evt => {
    evt.preventDefault();
    evt.stopPropagation();
    setPanelsState(s => ({
      pans: [ ...s.pans ].filter((item, i) => i !== index),
      activePan: (
        s.activePan === index // if we delete the selected, back to start
        ? 0
        : (index < s.activePan ? activePan - 1 : activePan) // if the deleted one is before the displayed, would get wrong order or > total
      ),
    }) );
  }

  const submitAddress = location => {
    setCenter(location);
    setActiveStep(1);
  };

  console.log("Rendering Home : ", { pans, activePan, center });

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
                  setActivePan={setActivePan(index)}
                  deletePan={deletePan(index)}
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
            setSurface={surface =>
              setPanelsState({
                ...panelsState,
                pans: pans.map((pan, index) => 
                  index === activePan
                  ? ({ ...pan, surface })
                  : pan
                )
              })
            }
            { ...panelsState }
            // activePan={activePan}
            // pans={pans}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Home;
