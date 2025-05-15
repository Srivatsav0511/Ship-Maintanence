import { notificationService } from './notificationService';
import { mockJobs } from './mockData';

const JOBS_KEY = 'maintenance_jobs';

export const maintenanceService = {
  async getJobs() {
    const jobs = localStorage.getItem(JOBS_KEY);
    if (!jobs) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(mockJobs));
      return mockJobs;
    }
    return JSON.parse(jobs);
  },

  getJobById: async (id) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.find(job => job.id === id);
  },

  async getJob(id) {
    const jobs = await maintenanceService.getJobs();
    return jobs.find(job => job.id === id);
  },

  getJobsByShip: async (shipId) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => job.shipId === shipId);
  },

  getJobsByComponent: async (componentId) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => job.componentId === componentId);
  },

  async createJob(jobData) {
    const jobs = await maintenanceService.getJobs();
    const newJob = {
      id: Date.now().toString(),
      ...jobData,
      status: 'scheduled',
      completedOnTime: false,
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    return newJob;
  },

  updateJob: async (id, jobData) => {
    const jobs = await maintenanceService.getJobs();
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      const updatedJob = { ...jobs[index], ...jobData };
      jobs[index] = updatedJob;
      localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
      return updatedJob;
    }
    return null;
  },

  deleteJob: async (id) => {
    const jobs = await maintenanceService.getJobs();
    const index = jobs.findIndex(job => job.id === id);
    if (index !== -1) {
      const jobToDelete = jobs[index];
      const filteredJobs = jobs.filter(job => job.id !== id);
      localStorage.setItem(JOBS_KEY, JSON.stringify(filteredJobs));
      return true;
    }
    return false;
  },

  getJobsByStatus: async (status) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => job.status === status);
  },

  getJobsByPriority: async (priority) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => job.priority === priority);
  },

  getJobsByEngineer: async (engineerId) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => job.assignedTo === engineerId);
  },

  getJobsByDateRange: async (startDate, endDate) => {
    const jobs = await maintenanceService.getJobs();
    return jobs.filter(job => {
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= new Date(startDate) && jobDate <= new Date(endDate);
    });
  }
}; 