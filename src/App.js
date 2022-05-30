import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import TopPage from './pages/TopPage';
import NotFound from './pages/NotFound';
import SearchState from './context/search/SearchState';
import ResultState from './context/result/ResultState';

import './styles/App.css';

const App = () => {
  return (
    <SearchState>
      <ResultState>
        <Router>
          <Header />
          <main>
            <div className='wrapper'>
              <Switch>
                <Route exact path='/' render={TopPage} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </Router>
      </ResultState>
    </SearchState>
  );
};

export default App;
