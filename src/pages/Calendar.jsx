import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { maintenanceService } from '../services/maintenanceService';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  CircularProgress,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Calendar() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [clickedDate, setClickedDate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState('dayGridMonth');
  const [loading, setLoading] = useState(false);

  const calendarRef = useRef(null); // Ref to control the calendar

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const jobList = await maintenanceService.getJobs();
      setJobs(jobList);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
    setLoading(false);
  };

  const handleDateClick = (dateStr) => {
    const jobsForDate = jobs.filter((job) => job.scheduledDate === dateStr);
    setSelectedJobs(jobsForDate);
    setClickedDate(dateStr);
    setDialogOpen(true);
  };

  const renderDayCell = (arg) => {
    const year = arg.date.getFullYear();
    const month = (arg.date.getMonth() + 1).toString().padStart(2, '0');
    const day = arg.date.getDate().toString().padStart(2, '0');
    const localDateStr = `${year}-${month}-${day}`;

    return (
      <div style={{ textAlign: 'center', padding: '2px' }}>
        <div>{arg.date.getDate()}</div>
        <Button
          size="small"
          variant="outlined"
          onClick={() => handleDateClick(localDateStr)}
          sx={{ mt: 0.5, fontSize: '0.6rem' }}
        >
          View Jobs
        </Button>
      </div>
    );
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Maintenance Calendar
      </Typography>

      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, nextView) => {
          if (nextView) {
            setView(nextView);
            const calendarApi = calendarRef.current?.getApi();
            if (calendarApi) {
              calendarApi.changeView(nextView);
            }
          }
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="dayGridMonth">Monthly</ToggleButton>
        <ToggleButton value="timeGridWeek">Weekly</ToggleButton>
      </ToggleButtonGroup>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={view}
          dayCellContent={renderDayCell}
          height="auto"
          events={[]}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Jobs on {clickedDate}
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedJobs.length === 0 ? (
            <Typography>No jobs scheduled on this date.</Typography>
          ) : (
            <List>
              {selectedJobs.map((job, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={job.jobType}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Priority: {job.priority || job.jobPriority}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Status: {job.status}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Assigned Engineer: {job.assignedEngineer || '-'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Component: {job.componentId || '-'}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Description: {job.description || '-'}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Calendar;