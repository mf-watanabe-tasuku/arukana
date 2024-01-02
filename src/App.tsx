import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import SearchState from './context/search/SearchState';
import ResultState from './context/result/ResultState';
import './App.css';
import { styled } from 'styled-components';

const StyleWrapper = styled.div`
  padding: 50px 30px 100px;
  background-color: #f5f6f9;
  height: 100%;
  min-height: 100vh;

  @media (max-width: 767px) {
    padding: 30px 15px 50px;
  }
`;

const StyledContainer = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const App = () => {
  return (
    <SearchState>
      <ResultState>
        <Router>
          <StyleWrapper>
            <StyledContainer>
              <Header />
              <main>
                <Switch>
                  <Route exact path='/' component={Home} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </StyledContainer>
          </StyleWrapper>
        </Router>
      </ResultState>
    </SearchState>
  );
};

export default App;