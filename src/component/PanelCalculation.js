import React from "react";

import {
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const PanelCalculation = ({ nb, pan, addPan, isActive, setActivePan, deletePan, nbPans }) => (
  <Paper
    style={{ background: '#f2f2f2', padding: '1.5em', margin: '1em 0'}}
    elevation={isActive ? 12 : 2}
    onClick={setActivePan}
  >
    <Typography variant='h6' style={{ display: 'flex', justifyContent: 'space-between'}} component='div'>
      <div style={{ display: 'flex' }}>
        <div style={{ backgroundColor: pan?.color, width: 30, height: 30 }}>{' '}</div>
        Pan { nb }
      </div>
      <div style={{ display: 'flex' }}>
        <IconButton onClick={deletePan} disabled={nbPans === 1}>
          <DeleteIcon />
        </IconButton>
        <IconButton onClick={addPan} disabled={nbPans === 4}>
          <AddIcon />
        </IconButton>
      </div>
    </Typography>
    <Typography>
      Surface :
      { pan.surface ? pan.surface.toLocaleString('fr-FR', { maximumFractionDigits: 2 }) : '--'} m2
    </Typography>
  </Paper>
);

export default PanelCalculation;