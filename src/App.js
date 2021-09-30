import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/layouts/header";
import Home from "./components/pages/Home";
import NotFound from "./components/pages/NotFound";

import LoadingState from "./context/loading/LoadingState";

import "./styles/App.css";

const App = () => {
  return (
    <LoadingState>
      <Router>
        <Header />
        <main>
          <div className="wrapper">
            <Switch>
              <Route exact path="/" render={Home} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
      </Router>
    </LoadingState>
  );
};

export default App;
