// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/login";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        {/* Puedes añadir más rutas aquí */}
      </Switch>
    </Router>
  );
};

export default App;
