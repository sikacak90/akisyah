import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SessionProvider from "./features/Session";

// import reportWebVitals from './reportWebVitals';
import App from "./App";
import Palette from "./features/Palette";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import "./styles/index.css";

import List from "./pages/List";
import Register from "./pages/Register";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Palette>
      <Router>
        <SessionProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/list/:eventType/:webhookID" element={<List />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SessionProvider>
      </Router>
    </Palette>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
