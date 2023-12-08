import { useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../../context/search/SearchContext';
import ResultContext from '../../context/result/ResultContext';

const StyledBtnSearch = styled.button`
  width: 300px;
  max-width: 100%;
  padding: 12px 0;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #33aaee;
  box-shadow: 0 6px 0 #006ba3;
  border: none;
  border-radius: 5px;
  margin: 25px auto 15px;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  @media (max-width: 767px) {
    margin-top: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const FormSubmit = ({ setLoading }) => {
  const { setResults } = useContext(ResultContext);
  const {
    validateSearchValues,
    getSearchResults
  } = useContext(SearchContext);

  // 検索ボタンを押した時の処理;
  const handleSubmit = async (e) => {
    if (e.key === 'Enter') return;
    e.preventDefault();

    const validationErrors = validateSearchValues();
    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults();
    setResults(results);
  };

  return(
    <StyledBtnSearch type='button' onClick={handleSubmit}>
      検索する
    </StyledBtnSearch>
  )
}


export default FormSubmit;
