import { mockShips, mockComponents } from './mockData';

const SHIPS_KEY = 'ships';
const COMPONENTS_KEY = 'components';

const generateId = (prefix) => `${prefix}-${Date.now()}`;

export const shipService = {
  // ------- SHIPS -------
  getShips: async () => {
    let storedShips = localStorage.getItem(SHIPS_KEY);
    if (!storedShips) {
      localStorage.setItem(SHIPS_KEY, JSON.stringify(mockShips));
      storedShips = JSON.stringify(mockShips);
    }
    return JSON.parse(storedShips);
  },

  getShipById: async (id) => {
    const ships = await shipService.getShips();
    return ships.find(ship => ship.id === id);
  },

  createShip: async (shipData) => {
    const ships = await shipService.getShips();
    const newShip = {
      id: generateId('s'),
      ...shipData,
      createdAt: new Date().toISOString()
    };
    ships.push(newShip);
    localStorage.setItem(SHIPS_KEY, JSON.stringify(ships));
    return newShip;
  },

  updateShip: async (id, shipData) => {
    const ships = await shipService.getShips();
    const index = ships.findIndex(ship => ship.id === id);
    if (index === -1) return null;

    ships[index] = { ...ships[index], ...shipData };
    localStorage.setItem(SHIPS_KEY, JSON.stringify(ships));
    return ships[index];
  },

  deleteShip: async (id) => {
    const ships = await shipService.getShips();
    const newShips = ships.filter(ship => ship.id !== id);
    if (newShips.length === ships.length) return false;

    localStorage.setItem(SHIPS_KEY, JSON.stringify(newShips));

    // Also delete its components
    const components = await shipService.getComponents();
    const updatedComponents = components.filter(c => c.shipId !== id);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(updatedComponents));

    return true;
  },

  // ------- COMPONENTS -------
  getComponents: async () => {
    let storedComponents = localStorage.getItem(COMPONENTS_KEY);
    if (!storedComponents) {
      localStorage.setItem(COMPONENTS_KEY, JSON.stringify(mockComponents));
      storedComponents = JSON.stringify(mockComponents);
    }
    return JSON.parse(storedComponents);
  },

  getComponentsByShipId: async (shipId) => {
    const components = await shipService.getComponents();
    return components.filter(comp => comp.shipId === shipId);
  },

  addComponent: async (shipId, component) => {
    const ship = await shipService.getShipById(shipId);
    if (!ship) return undefined;

    const components = await shipService.getComponents();
    const newComponent = {
      id: generateId('c'),
      shipId,
      installDate: new Date().toISOString(),
      ...component
    };
    components.push(newComponent);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
    return newComponent;
  },

  updateComponent: async (shipId, componentId, updates) => {
    const components = await shipService.getComponents();
    const index = components.findIndex(c => c.id === componentId && c.shipId === shipId);
    if (index === -1) return undefined;

    components[index] = { ...components[index], ...updates };
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
    return components[index];
  },

  deleteComponent: async (shipId, componentId) => {
    const components = await shipService.getComponents();
    const index = components.findIndex(c => c.id === componentId && c.shipId === shipId);
    if (index === -1) return undefined;

    components.splice(index, 1);
    localStorage.setItem(COMPONENTS_KEY, JSON.stringify(components));
    return true;
  }
};