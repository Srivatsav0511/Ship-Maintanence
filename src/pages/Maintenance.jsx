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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { maintenanceService } from '../services/maintenanceService';
import { shipService } from '../services/shipService';
import { componentService } from '../services/componentService';
import { authService } from '../services/authService';
import { useNotification } from '../context/NotificationContext';

function Maintenance() {
  const [jobs, setJobs] = useState([]);
  const [ships, setShips] = useState([]);
  const [components, setComponents] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({ shipId: '', status: '', priority: '' });
  const [formData, setFormData] = useState({
    jobType: '',
    description: '',
    shipId: '',
    componentId: '',
    priority: 'medium',
    status: 'scheduled',
    assignedEngineer: '',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Get engineers from mock users
    setEngineers(authService.getAllUsers ? authService.getAllUsers().filter(u => u.role === 'engineer') : []);
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [jobsData, shipsData, componentsData] = await Promise.all([
      maintenanceService.getJobs(),
      shipService.getShips(),
      componentService.getComponents()
    ]);
    setJobs(jobsData);
    setShips(shipsData);
    setComponents(componentsData);
    setLoading(false);
  };

  const handleOpen = (job) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        jobType: job.title,
        description: job.description,
        shipId: job.shipId,
        componentId: job.componentId,
        priority: job.priority,
        status: job.status,
        assignedEngineer: job.assignedEngineer,
        dueDate: job.dueDate.split('T')[0]
      });
    } else {
      setEditingJob(null);
      setFormData({
        jobType: '',
        description: '',
        shipId: '',
        componentId: '',
        priority: 'medium',
        status: 'scheduled',
        assignedEngineer: '',
        dueDate: new Date().toISOString().split('T')[0]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingJob(null);
  };

  const handleSubmit = async () => {
    if (!formData.jobType || !formData.shipId || !formData.componentId) {
      return;
    }

    if (editingJob) {
      const prevStatus = editingJob.status;
      await maintenanceService.updateJob(editingJob.id, formData);
      addNotification({ message: 'Job updated successfully!', severity: 'info' });
      if (formData.status === 'completed' && prevStatus !== 'completed') {
        addNotification({ message: 'Job marked as completed!', severity: 'success' });
      }
    } else {
      await maintenanceService.createJob(formData);
      addNotification({ message: 'Job created successfully!', severity: 'success' });
    }

    handleClose();
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance job?')) {
      await maintenanceService.deleteJob(id);
      loadData();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'scheduled':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredJobs = jobs.filter(job =>
    (!filters.shipId || job.shipId === filters.shipId) &&
    (!filters.status || job.status === filters.status) &&
    (!filters.priority || job.priority === filters.priority)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Maintenance Jobs</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Job
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Ship</InputLabel>
          <Select
            value={filters.shipId}
            label="Ship"
            onChange={e => setFilters(f => ({ ...f, shipId: e.target.value }))}
          >
            <MenuItem value="">All Ships</MenuItem>
            {ships.map(ship => (
              <MenuItem key={ship.id} value={ship.id}>{ship.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filters.priority}
            label="Priority"
            onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filteredJobs.map((job) => (
            <Card key={job.id} sx={{ boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" component="div">
                    {job.jobType}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleOpen(job)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(job.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {job.description}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Ship: {ships.find(s => s.id === job.shipId)?.name || '-'}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Component: {components.find(c => c.id === job.componentId)?.name || '-'}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Assigned Engineer: {engineers.find(e => e.id === job.assignedEngineer)?.name || '-'}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <Chip
                    label={job.priority}
                    color={getPriorityColor(job.priority)}
                    size="small"
                  />
                  <Chip
                    label={job.status}
                    color={getStatusColor(job.status)}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Due: {new Date(job.dueDate).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {editingJob ? 'Edit Maintenance Job' : 'Add New Maintenance Job'}
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Job Type"
            fullWidth
            margin="normal"
            value={formData.jobType}
            onChange={e => setFormData({ ...formData, jobType: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Ship</InputLabel>
            <Select
              value={formData.shipId}
              label="Ship"
              onChange={e => setFormData({ ...formData, shipId: e.target.value, componentId: '' })}
            >
              {ships.map(ship => (
                <MenuItem key={ship.id} value={ship.id}>{ship.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Component</InputLabel>
            <Select
              value={formData.componentId}
              label="Component"
              onChange={e => setFormData({ ...formData, componentId: e.target.value })}
              disabled={!formData.shipId}
            >
              {components.filter(c => c.shipId === formData.shipId).map(component => (
                <MenuItem key={component.id} value={component.id}>{component.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              label="Priority"
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned Engineer</InputLabel>
            <Select
              value={formData.assignedEngineer}
              label="Assigned Engineer"
              onChange={e => setFormData({ ...formData, assignedEngineer: e.target.value })}
            >
              {engineers.map(engineer => (
                <MenuItem key={engineer.id} value={engineer.id}>{engineer.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            margin="normal"
            value={formData.dueDate}
            onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingJob ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Maintenance; 