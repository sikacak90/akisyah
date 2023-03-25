import React, { createContext, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const sessionContext = createContext();

const SessionProvider = ({ children }) => {
  const navigate = useNavigate();
  const INITIAL_SESSION = useRef({
    isLoggedIn: false,
    userData: {},
  });
  const [session, setSession] = useState(INITIAL_SESSION.current);

  const login = useCallback((userData) => {
    setSession({
      isLoggedIn: true,
      userData,
    });
  }, []);

  const fetchUserAuth = useCallback(async () => {
    return fetch("/auth/isAuth")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.user) {
          login(data.user);
          return data.user;
        } else {
          return Promise.reject("No user data");
        }
      })
      .catch((error) => {
        console.error("There was an error fetch auth", error);
        return;
      });
  }, [login]);

  const logout = useCallback(() => {
    setSession(INITIAL_SESSION.current);
    navigate("/api/logout/");
  }, [navigate]);

  return (
    <sessionContext.Provider value={{ session, login, logout, fetchUserAuth }}>
      {children}
    </sessionContext.Provider>
  );
};

export default SessionProvider;
