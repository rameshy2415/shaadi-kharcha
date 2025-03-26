import { useState, createContext } from "react";

/* let init = {
  auth: false,
  keycloak: null,
  login: () => {},
  logout: () => {},
}; */

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authFlag, setAuthFlag] = useState(false);

  return (
    <UserContext.Provider value={{ user, setUser, authFlag, setAuthFlag }}>
      {children}
    </UserContext.Provider>
  );
};

export default AuthProvider;
