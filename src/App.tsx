import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { styled } from 'styled-components';
import './App.css';
import { FormProvider } from './context/FormContext';
import { LoadingProvider } from './context/LoadingContext';
import { ResultsProvider } from './context/ResultsContext';
import Header from './components/Header';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

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
  max-width: 900px;
  margin: 0 auto;
`;

const App = () => {
  return (
    <FormProvider>
      <ResultsProvider>
        <LoadingProvider>
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
        </LoadingProvider>
      </ResultsProvider>
    </FormProvider>
  );
};

export default App;
