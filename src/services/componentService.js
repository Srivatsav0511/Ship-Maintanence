import { notificationService } from './notificationService';
import { mockComponents } from './mockData';

const COMPONENTS_KEY = 'components';

const generateId = () => `c-${Date.now()}`;

export const componentService = {
  // Reset all components to mock data
  async reset() {
    localStorage.removeItem(COMPONENTS_KEY);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(mockComponents));
    return mockComponents;
  },

  // Get all components
  async getComponents() {
    const stored = localStorage.getItem(COMPONENTS_KEY);
    if (!stored) {
      return this.reset();
    }
    return JSON.parse(stored);
  },

  // Get a single component by ID
  async getComponent(id) {
    const components = await this.getComponents();
    return components.find(component => component.id === id);
  },

  // Get all components for a specific ship
  async getComponentsByShip(shipId) {
    const components = await this.getComponents();
    return components.filter(component => component.shipId === shipId);
  },

  // Create a new component
  async createComponent(data) {
    const components = await this.getComponents();
    const newComponent = {
      id: generateId(),
      ...data,
      maintenanceHistory: [],
      createdAt: new Date().toISOString()
    };

    components.push(newComponent);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));

    await notificationService.createNotification({
      type: 'component_created',
      title: 'New Component Added',
      message: `New component added: ${newComponent.name}`,
      priority: 'info'
    });

    return newComponent;
  },

  // Update an existing component
  async updateComponent(id, updates) {
    const components = await this.getComponents();
    const index = components.findIndex(component => component.id === id);
    if (index === -1) return null;

    const updatedComponent = {
      ...components[index],
      ...updates
    };

    components[index] = updatedComponent;
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));

    await notificationService.createNotification({
      type: 'component_updated',
      title: 'Component Updated',
      message: `Component updated: ${updatedComponent.name}`,
      priority: 'info'
    });

    return updatedComponent;
  },

  // Delete a component
  async deleteComponent(id) {
    const components = await this.getComponents();
    const index = components.findIndex(component => component.id === id);
    if (index === -1) return false;

    const deletedComponent = components[index];
    const filtered = components.filter(component => component.id !== id);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(filtered));

    await notificationService.createNotification({
      type: 'component_deleted',
      title: 'Component Deleted',
      message: `Component deleted: ${deletedComponent.name}`,
      priority: 'warning'
    });

    return true;
  },

  // Update the last maintenance date of a component
  async updateLastMaintenanceDate(id, date) {
    const components = await this.getComponents();
    const index = components.findIndex(component => component.id === id);
    if (index === -1) return null;

    const updatedComponent = {
      ...components[index],
      lastMaintenanceDate: date
    };

    components[index] = updatedComponent;
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));

    await notificationService.createNotification({
      type: 'success',
      title: 'Maintenance Updated',
      message: `Maintenance date updated for: ${updatedComponent.name}`,
      priority: 'success'
    });

    return updatedComponent;
  }
};