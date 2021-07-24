import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import { isAuth } from "./auth";
import { Routes } from "./Routes";

function App() {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    let getAuth = async () => {
      try {
        let [valid] = await isAuth();
        setAuth(valid);
      } catch (e) {
        console.log(e);
      }
    };
    getAuth();
  }, []);
  return (
    <Router>
      <Routes auth={auth} setAuth={setAuth} />
    </Router>
  );
}

export default App;
