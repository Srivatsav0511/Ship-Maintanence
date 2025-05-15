export const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  },
  {
    id: "2",
    name: "Inspector User",
    email: "inspector@gmail.com",
    password: "inspector123",
    role: "inspector"
  },
  {
    id: "3",
    name: "Engineer User",
    email: "engineer@gmail.com",
    password: "engineer123",
    role: "engineer"
  }
];

export const mockShips = [
  {
    id: "s1",
    name: "Ever Given",
    type: "Container Ship",
    buildYear: "2018",
    status: "active",
    components: []
  },
  {
    id: "s2",
    name: "Maersk Alabama",
    type: "Cargo Ship",
    buildYear: "2019",
    status: "maintenance",
    components: []
  }
];

export const mockComponents = [
  {
    id: "c1",
    shipId: "s1",
    name: "Main Engine",
    type: "Engine",
    status: "operational",
    lastMaintenanceDate: "2024-03-12",
    nextMaintenanceDate: "2024-09-12",
    maintenanceInterval: 6,
    maintenanceHistory: [
      {
        date: "2024-03-12",
        description: "Regular maintenance check"
      }
    ]
  },
  {
    id: "c2",
    shipId: "s2",
    name: "Radar System",
    type: "Navigation",
    status: "maintenance_required",
    lastMaintenanceDate: "2023-12-01",
    nextMaintenanceDate: "2024-06-01",
    maintenanceInterval: 6,
    maintenanceHistory: [
      {
        date: "2023-12-01",
        description: "Software update and calibration"
      }
    ]
  },
  {
    id: "c3",
    shipId: "s1",
    name: "Propeller",
    type: "Propulsion",
    status: "operational",
    lastMaintenanceDate: "2024-02-15",
    nextMaintenanceDate: "2024-08-15",
    maintenanceInterval: 6,
    maintenanceHistory: [
      {
        date: "2024-02-15",
        description: "Regular inspection and cleaning"
      }
    ]
  }
];

export const mockJobs = [
  {
    id: "j1",
    title: "Main Engine Inspection",
    description: "Regular inspection of main engine components",
    status: "scheduled",
    startDate: "2024-05-05",
    endDate: "2024-05-07",
    scheduledDate: "2024-05-05",
    completedOnTime: false,
    assignedTo: "3",
    shipId: "s1",
    componentId: "c1",
    priority: "high",
    notes: "Check all engine parameters and perform necessary maintenance"
  },
  {
    id: "j2",
    title: "Radar System Maintenance",
    description: "Scheduled maintenance of radar system",
    status: "in_progress",
    startDate: "2024-03-15",
    endDate: "2024-03-16",
    scheduledDate: "2024-03-15",
    completedOnTime: true,
    assignedTo: "3",
    shipId: "s2",
    componentId: "c2",
    priority: "medium",
    notes: "Calibrate radar system and update software"
  },
  {
    id: "j3",
    title: "Hull Inspection",
    description: "Regular hull inspection and cleaning",
    status: "completed",
    startDate: "2024-02-01",
    endDate: "2024-02-03",
    scheduledDate: "2024-02-01",
    completedOnTime: true,
    assignedTo: "2",
    shipId: "s1",
    priority: "low",
    notes: "Hull cleaning and anti-fouling paint application completed"
  }
];

export const mockNotifications = [
  {
    id: '1',
    title: 'Maintenance Due',
    message: 'Engine maintenance is due in 7 days',
    type: 'warning',
    createdAt: '2024-03-01T10:00:00Z',
    read: false
  },
  {
    id: '2',
    title: 'Job Completed',
    message: 'Navigation system maintenance completed successfully',
    type: 'success',
    createdAt: '2024-03-02T14:30:00Z',
    read: true
  }
]; 