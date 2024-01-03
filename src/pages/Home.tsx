import { useEffect, useContext } from 'react';
import ResultContext from '../context/result/ResultContext';
import Form from '../components/Form/Form';
import Results from '../components/Result/Result';

const Home = () => {
  const { results } = useContext(ResultContext);

  useEffect(() => {
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
    googleMapScript.async = true;
    document.body.appendChild(googleMapScript);
  }, []);

  return (
    <>{results.length > 0 ? <Results /> : <Form />}</>
  );
};

export default Home;
