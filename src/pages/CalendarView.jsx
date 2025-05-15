import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { jobService } from '../services/jobService';
import { shipService } from '../services/shipService';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

const CalendarView = () => {
  const [selectedShip, setSelectedShip] = useState('');
  const [ships, setShips] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDateJobs, setSelectedDateJobs] = useState([]);

  useEffect(() => {
    shipService.getShips().then(setShips);
  }, []);

  useEffect(() => {
    if (selectedShip) {
      jobService.getJobsByShip(selectedShip).then(jobs => {
        const calendarEvents = jobs.map(job => ({
          title: `${job.type} - ${job.status}`,
          date: job.scheduledDate,
          extendedProps: job
        }));
        setEvents(calendarEvents);
      });
    } else {
      setEvents([]);
    }
  }, [selectedShip]);

  const handleDateClick = (info) => {
    const jobsOnDate = events.filter(event => event.date === info.dateStr);
    setSelectedDateJobs(jobsOnDate.map(e => e.extendedProps));
  };

  return (
    <Box sx={{ p: 4 }}>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Ship</InputLabel>
        <Select value={selectedShip} onChange={(e) => setSelectedShip(e.target.value)} label="Select Ship">
          {ships.map(ship => (
            <MenuItem key={ship.id} value={ship.id}>
              {ship.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
      />

      {selectedDateJobs.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Jobs on Selected Date:</Typography>
          {selectedDateJobs.map((job, index) => (
            <Box key={index} sx={{ p: 1, borderBottom: '1px solid #ccc' }}>
              <Typography><strong>Type:</strong> {job.type}</Typography>
              <Typography><strong>Status:</strong> {job.status}</Typography>
              <Typography><strong>Priority:</strong> {job.priority}</Typography>
              <Typography><strong>Engineer ID:</strong> {job.assignedEngineerId}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CalendarView;