import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import TopPage from "./pages/TopPage";
import NotFound from "./pages/NotFound";

import SearchState from "./context/search/SearchState";
import PlaceState from "./context/place/PlaceState";

import "./styles/App.css";

const App = () => {
  return (
    <SearchState>
      <PlaceState>
        <Router>
          <Header />
          <main>
            <div className="wrapper">
              <Switch>
                <Route exact path="/" render={TopPage} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </Router>
      </PlaceState>
    </SearchState>
  );
};

export default App;
