import { useState, createContext } from "react";

export const ApplicationContext = createContext();

const ApplicationContextProvider = ({ children }) => {
  //const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <ApplicationContext.Provider value={{ loading, setLoading }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationContextProvider;
