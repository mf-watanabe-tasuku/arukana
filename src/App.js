import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import TopPage from './pages/TopPage';
import NotFound from './pages/NotFound';
import SearchState from './context/search/SearchState';
import ResultState from './context/result/ResultState';
import LoadingState from './context/loading/LoadingState';
import './styles/App.css';

const App = () => {
  return (
    <SearchState>
      <ResultState>
        <LoadingState>
          <Router>
            <Header />
            <main>
              <div className='wrapper'>
                <Switch>
                  <Route exact path='/' component={TopPage} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </main>
          </Router>
        </LoadingState>
      </ResultState>
    </SearchState>
  );
};

export default App;
