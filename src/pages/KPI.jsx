import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { maintenanceService } from '../services/maintenanceService';
import { shipService } from '../services/shipService';
import { componentService } from '../services/componentService';
import Charts from '../components/Dashboard/Charts';
import KPICards from '../components/Dashboard/KPICards';

function KPI() {
  const [stats, setStats] = useState({
    totalShips: 0,
    overdueComponents: 0,
    activeJobs: 0,
    completedJobs: 0
  });
  const [jobStatusData, setJobStatusData] = useState([]);
  const [componentStatusData, setComponentStatusData] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobs, ships, components] = await Promise.all([
        maintenanceService.getJobs(),
        shipService.getShips(),
        componentService.getComponents()
      ]);
      // Calculate KPI stats
      const activeJobs = Array.isArray(jobs) ? jobs.filter(job => job.status === 'in_progress').length : 0;
      const completedJobs = Array.isArray(jobs) ? jobs.filter(job => job.status === 'completed').length : 0;
      const overdueComponents = Array.isArray(components)
        ? components.filter(comp => {
            const dueDate = new Date(comp.nextMaintenanceDate);
            return dueDate instanceof Date && !isNaN(dueDate) && dueDate < new Date() && comp.status !== 'maintained';
          }).length
        : 0;
      setStats({
        totalShips: Array.isArray(ships) ? ships.length : 0,
        overdueComponents,
        activeJobs,
        completedJobs
      });
      // Prepare chart data
      const jobStatusCounts = Array.isArray(jobs)
        ? jobs.reduce((acc, job) => {
            acc[job.status] = (acc[job.status] || 0) + 1;
            return acc;
          }, {})
        : {};
      setJobStatusData(
        Object.entries(jobStatusCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
          value
        }))
      );
      const componentStatusCounts = Array.isArray(components)
        ? components.reduce((acc, comp) => {
            acc[comp.status] = (acc[comp.status] || 0) + 1;
            return acc;
          }, {})
        : {};
      setComponentStatusData(
        Object.entries(componentStatusCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value
        }))
      );
      // Get upcoming maintenance
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcoming = Array.isArray(components)
        ? components
            .filter(comp => {
              const dueDate = new Date(comp.nextMaintenanceDate);
              return (
                dueDate instanceof Date &&
                !isNaN(dueDate) &&
                dueDate >= new Date() &&
                dueDate <= nextWeek
              );
            })
            .map(comp => ({
              ...comp,
              shipName: Array.isArray(ships)
                ? ships.find(s => s.id === comp.shipId)?.name || 'Unknown Ship'
                : 'Unknown Ship'
            }))
            .sort((a, b) => new Date(a.nextMaintenanceDate) - new Date(b.nextMaintenanceDate))
        : [];
      setUpcomingMaintenance(upcoming);
    } catch (err) {
      setError('Failed to load KPI data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        KPI Dashboard
      </Typography>
      {error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <KPICards stats={stats} />
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Maintenance Job Status
                </Typography>
                <Charts data={jobStatusData} type="pie" />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Component Status
                </Typography>
                <Charts data={componentStatusData} type="pie" />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, boxShadow: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                  Upcoming Maintenance (Next 7 Days)
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '8px' }} scope="col">Component</th>
                        <th style={{ textAlign: 'left', padding: '8px' }} scope="col">Ship</th>
                        <th style={{ textAlign: 'left', padding: '8px' }} scope="col">Due Date</th>
                        <th style={{ textAlign: 'left', padding: '8px' }} scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingMaintenance.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '8px', textAlign: 'center', color: '#888' }}>
                            No upcoming maintenance in the next 7 days.
                          </td>
                        </tr>
                      ) : (
                        upcomingMaintenance.map((comp) => (
                          <tr key={comp.id || comp.name + comp.shipName}>
                            <td style={{ padding: '8px' }}>{comp.name}</td>
                            <td style={{ padding: '8px' }}>{comp.shipName}</td>
                            <td style={{ padding: '8px' }}>
                              {comp.nextMaintenanceDate && !isNaN(new Date(comp.nextMaintenanceDate))
                                ? new Date(comp.nextMaintenanceDate).toLocaleDateString()
                                : 'N/A'}
                            </td>
                            <td style={{ padding: '8px' }}>{comp.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default KPI; 