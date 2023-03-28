import React, { createContext, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket.io/socket';

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
    return fetch('/auth/user')
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data && data.user) {
          login(data.user);
          return data.user;
        } else {
          return Promise.reject('No user data');
        }
      })
      .catch((error) => {
        console.log('There was an error fetch auth: ', error);
        return;
      });
  }, [login]);

  const logout = useCallback(() => {
    fetch('/auth/logout', {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSession(INITIAL_SESSION.current);
        socket.disconnect();
        navigate('/');
      });
  }, [navigate]);

  const updateWebhooks = useCallback(
    (webhook, action) => {
      const newWebhooks = [...session.userData.webhooks];
      if (action === 'add') {
        newWebhooks.push(webhook);
      }
      if (action === 'delete') {
        const index = newWebhooks.findIndex((wh) => wh._id === webhook._id);
        newWebhooks.splice(index, 1);
      }
      setSession((prevSession) => ({
        ...prevSession,
        userData: {
          ...prevSession.userData,
          webhooks: newWebhooks,
        },
      }));
    },
    [session.userData.webhooks]
  );

  return (
    <sessionContext.Provider
      value={{ session, login, logout, fetchUserAuth, updateWebhooks }}
    >
      {children}
    </sessionContext.Provider>
  );
};

export default SessionProvider;
