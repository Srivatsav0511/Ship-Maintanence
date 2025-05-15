import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, TextField, Typography, Grid, Chip, Stack, MenuItem
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { shipService } from '../services/shipService';
import { componentService } from '../services/componentService';
import { maintenanceService } from '../services/maintenanceService';
import { useNotification } from '../context/NotificationContext';

function Ships() {
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);
  const [open, setOpen] = useState(false);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editingShip, setEditingShip] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    buildYear: new Date().getFullYear().toString(),
    status: 'active',
    jobDate: '',
    jobType: '',
    jobPriority: '',
    shipId: ''
  });
  const { addNotification } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const shipsData = await shipService.getShips();
    const componentsData = await componentService.getComponents();
    setShips(shipsData);
    setComponents(componentsData);
  };

  const handleOpen = (ship) => {
    if (ship) {
      setEditingShip(ship);
      setFormData(prev => ({
        ...prev,
        name: ship.name,
        type: ship.type,
        buildYear: ship.buildYear.toString(),
        status: ship.status,
        shipId: ship.id
      }));
    } else {
      setEditingShip(null);
      setFormData({
        name: '',
        type: '',
        buildYear: new Date().getFullYear().toString(),
        status: 'active',
        jobDate: '',
        jobType: '',
        jobPriority: '',
        shipId: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingShip(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) return;

    if (editingShip) {
      await shipService.updateShip(editingShip.id, formData);
    } else {
      await shipService.createShip(formData);
    }

    handleClose();
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ship?')) {
      await shipService.deleteShip(id);
      loadData();
    }
  };

  const handleJobSubmit = async () => {
    const { jobDate, jobType, jobPriority, shipId } = formData;

    if (!jobDate || !jobType || !jobPriority || !shipId) {
      alert('Please fill all job fields');
      return;
    }

    const jobData = { scheduledDate: jobDate, jobType, jobPriority, shipId };
    await maintenanceService.createJob(jobData);

    setFormData(prev => ({
      ...prev,
      jobDate: '',
      jobType: '',
      jobPriority: ''
    }));
    setOpenJobDialog(false);
    loadData();
    addNotification({ message: 'Job scheduled successfully!', severity: 'success' });
  };

  const getShipComponents = (shipId) => components.filter(comp => comp.shipId === shipId);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ships</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Ship
        </Button>
      </Box>

      <Grid container spacing={3}>
        {ships.map((ship) => (
          <Grid item xs={12} md={6} lg={4} key={ship.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">{ship.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpen(ship)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(ship.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography>Type: {ship.type}</Typography>
                <Typography>Build Year: {ship.buildYear}</Typography>
                <Chip label={ship.status} color={getStatusColor(ship.status)} size="small" sx={{ mt: 1 }} />
                <Typography sx={{ mt: 2 }}>Components:</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {getShipComponents(ship.id).map((comp) => (
                    <Chip key={comp.id} label={comp.name} size="small" variant="outlined" />
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      shipId: ship.id
                    }));
                    setOpenJobDialog(true);
                  }}
                >
                  Schedule Maintenance
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ship Form Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingShip ? 'Edit Ship' : 'Add Ship'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <TextField label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
            <TextField label="Build Year" type="number" value={formData.buildYear} onChange={(e) => setFormData({ ...formData, buildYear: e.target.value })} />
            <TextField select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingShip ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Job Scheduling Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Maintenance Job</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField type="date" label="Job Date" InputLabelProps={{ shrink: true }} value={formData.jobDate} onChange={(e) => setFormData({ ...formData, jobDate: e.target.value })} />
            <TextField label="Job Type" value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })} />
            <TextField label="Job Priority" value={formData.jobPriority} onChange={(e) => setFormData({ ...formData, jobPriority: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleJobSubmit}>Schedule</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Ships;