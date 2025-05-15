
const API_URL = 'http://localhost:5000/api/jobs';

export const jobService = {
  createJob: async (jobData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (!response.ok) throw new Error('Failed to create job');
      return await response.json();
    } catch (error) {
      console.error('Error creating job:', error);
    }
  },
  
  // Helper for ship-specific jobs
  getJobsByShip: async (shipId) => {
    const allJobs = await jobService.getJobs();
    return allJobs.filter(job => job.shipId === shipId);
  },

  getJobs: async () => {
    try {
      const response = await fetch(API_URL);
      return await response.json();
    } catch (err) {
      console.error('Error:', err);
      return [];
    }
  }
};