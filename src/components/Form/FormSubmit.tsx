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

type FormSubmitProps = {
  setLoading: (loading: boolean) => void
}

const FormSubmit: React.FC<FormSubmitProps> = ({ setLoading }) => {
  const { setResults } = useContext(ResultContext);
  const {
    validateSearchValues,
    getSearchResults
  } = useContext(SearchContext);

  // 検索ボタンを押した時の処理;
  const handleSubmit = async () => {
    const validationErrors = validateSearchValues();
    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults();
    setResults(results);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  }

  return(
    <StyledBtnSearch type='button' onClick={handleSubmit} onKeyDown={handleKeyDown}>
      検索する
    </StyledBtnSearch>
  )
}


export default FormSubmit;
