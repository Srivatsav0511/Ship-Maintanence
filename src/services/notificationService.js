import { mockNotifications } from './mockData';

const NOTIFICATIONS_KEY = 'notifications';
const subscribers = new Set();

class NotificationService {
  constructor() {
    this.notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || mockNotifications;
  }

  subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  notifySubscribers(notification) {
    subscribers.forEach(callback => callback(notification));
  }

  async getNotifications() {
    return this.notifications.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  async createNotification({ type, title, message, priority = 'info' }) {
    const newNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      priority,
      createdAt: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifySubscribers(newNotification);
    return newNotification;
  }

  async markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  async markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.saveNotifications();
  }

  async deleteNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
  }

  async deleteAll() {
    this.notifications = [];
    this.saveNotifications();
  }

  saveNotifications() {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(this.notifications));
  }

  // Helper methods for creating specific types of notifications
  async notifyJobCreated(job) {
    return this.createNotification({
      type: 'info',
      title: 'New Maintenance Job',
      message: `Job "${job.title}" has been created`,
      priority: 'info'
    });
  }

  async notifyJobUpdated(job) {
    return this.createNotification({
      type: 'info',
      title: 'Job Updated',
      message: `Job "${job.title}" has been updated`,
      priority: 'info'
    });
  }

  async notifyJobCompleted(job) {
    return this.createNotification({
      type: 'success',
      title: 'Job Completed',
      message: `Job "${job.title}" has been completed`,
      priority: 'success'
    });
  }

  async notifyMaintenanceDue(component) {
    return this.createNotification({
      type: 'warning',
      title: 'Maintenance Due',
      message: `Maintenance for "${component.name}" is due soon`,
      priority: 'warning'
    });
  }
}

export const notificationService = new NotificationService(); 