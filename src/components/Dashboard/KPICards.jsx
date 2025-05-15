import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import {
  DirectionsBoat as ShipIcon,
  Build as ComponentIcon,
  Engineering as MaintenanceIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';

function KPICards({ stats }) {
  const cards = [
    {
      title: 'Total Ships',
      value: stats.totalShips,
      icon: <ShipIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2'
    },
    {
      title: 'Overdue Components',
      value: stats.overdueComponents,
      icon: <ComponentIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: <MaintenanceIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02'
    },
    {
      title: 'Completed Jobs',
      value: stats.completedJobs,
      icon: <CompletedIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32'
    }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: card.color,
              color: 'white'
            }}
          >
            {card.icon}
            <Typography variant="h4" component="div" sx={{ mt: 1 }}>
              {card.value}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {card.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default KPICards; 