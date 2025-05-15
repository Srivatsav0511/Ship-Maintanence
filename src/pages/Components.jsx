import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Grid,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { componentService } from '../services/componentService';
import { shipService } from '../services/shipService';

function Components() {
  const [components, setComponents] = useState([]);
  const [ships, setShips] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    shipId: '',
    type: '',
    status: 'operational',
    installationDate: new Date().toISOString().split('T')[0],
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    nextMaintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceInterval: '6'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [componentsData, shipsData] = await Promise.all([
        componentService.reset(),
        shipService.getShips()
      ]);
      setComponents(componentsData);
      setShips(shipsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleOpen = (component) => {
    if (component) {
      setEditingComponent(component);
      setFormData({
        name: component.name,
        serialNumber: component.serialNumber || '',
        shipId: component.shipId,
        type: component.type,
        status: component.status,
        installationDate: component.installationDate ? component.installationDate.split('T')[0] : new Date().toISOString().split('T')[0],
        lastMaintenanceDate: component.lastMaintenanceDate.split('T')[0],
        nextMaintenanceDate: component.nextMaintenanceDate.split('T')[0],
        maintenanceInterval: component.maintenanceInterval.toString()
      });
    } else {
      setEditingComponent(null);
      setFormData({
        name: '',
        serialNumber: '',
        shipId: '',
        type: '',
        status: 'operational',
        installationDate: new Date().toISOString().split('T')[0],
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        nextMaintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceInterval: '6'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingComponent(null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.shipId || !formData.type) {
      return;
    }

    if (editingComponent) {
      await componentService.updateComponent(editingComponent.id, formData);
    } else {
      await componentService.createComponent(formData);
    }

    handleClose();
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      await componentService.deleteComponent(id);
      loadData();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'success';
      case 'maintenance_required':
        return 'warning';
      case 'non_operational':
        return 'error';
      default:
        return 'default';
    }
  };

  const getShipName = (shipId) => {
    const ship = ships.find(s => s.id === shipId);
    return ship ? ship.name : 'Unknown Ship';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Components</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Component
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {components.map((component) => (
            <Grid item xs={12} md={6} lg={4} key={component.id}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div">
                      {component.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpen(component)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(component.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography color="text.secondary" gutterBottom>
                    Ship: {getShipName(component.shipId)}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Type: {component.type}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Serial Number: {component.serialNumber || '-'}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    Installation Date: {component.installationDate ? new Date(component.installationDate).toLocaleDateString() : '-'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip
                      label={component.status.replace('_', ' ')}
                      color={getStatusColor(component.status)}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Last Maintenance: {new Date(component.lastMaintenanceDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next Maintenance: {new Date(component.nextMaintenanceDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maintenance Interval: {component.maintenanceInterval} months
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editingComponent ? 'Edit Component' : 'Add New Component'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Serial Number"
              fullWidth
              margin="normal"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Ship</InputLabel>
              <Select
                value={formData.shipId}
                label="Ship"
                onChange={(e) => setFormData({ ...formData, shipId: e.target.value })}
              >
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Type"
              fullWidth
              margin="normal"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="operational">Operational</MenuItem>
                <MenuItem value="maintenance_required">Maintenance Required</MenuItem>
                <MenuItem value="non_operational">Non-Operational</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Installation Date"
              type="date"
              fullWidth
              margin="normal"
              value={formData.installationDate}
              onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Last Maintenance Date"
              type="date"
              fullWidth
              margin="normal"
              value={formData.lastMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, lastMaintenanceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Next Maintenance Date"
              type="date"
              fullWidth
              margin="normal"
              value={formData.nextMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Maintenance Interval (months)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.maintenanceInterval}
              onChange={(e) => setFormData({ ...formData, maintenanceInterval: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingComponent ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Components; 