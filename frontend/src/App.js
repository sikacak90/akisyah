import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sessionContext } from "./features/Session";
import Login from "./pages/Login";

function App() {
  const { fetchUserAuth, session } = useContext(sessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAuth()
      .then(() => {
        if (session.isLoggedIn) {
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [fetchUserAuth, session, navigate]);

  return (
    <>
      <Login />
    </>
  );
}

export default App;
