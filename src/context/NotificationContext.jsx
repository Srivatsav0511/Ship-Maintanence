import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const initialState = [];

function notificationReducer(state, action) {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, action.payload];
    case 'REMOVE_NOTIFICATION':
      return state.filter(n => n.id !== action.id);
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...notification, id: Date.now() } });
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', id });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext); 