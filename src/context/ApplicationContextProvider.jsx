import { useState, createContext } from "react";

export const ApplicationContext = createContext();

const ApplicationContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  return (
    <ApplicationContext.Provider value={{ loading, setLoading, message, setMessage }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
