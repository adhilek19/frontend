import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext();
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message) => {
    const id = Date.now();

    const newNotification = { id, message };

    setNotifications((prev) => [newNotification, ...prev]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id)
      );
    }, 4000);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};