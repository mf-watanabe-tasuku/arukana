import { useContext } from 'react';
import { styled } from 'styled-components';
import type { SetLoading } from '../../types';
import SearchContext from '../../context/search/SearchContext';
import ResultContext from '../../context/result/ResultContext';
import { getSearchResults, hasErrorMessages } from '../../utils/search';

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
  setLoading: SetLoading
}

const FormSubmit: React.FC<FormSubmitProps> = ({ setLoading }) => {
  const { setResults } = useContext(ResultContext);
  const {
    originAddress,
    radius,
    targetKeywords,
    errorMessages,
    setOriginGeocode,
    validateSearchValues
  } = useContext(SearchContext);

  // 検索ボタンを押した時の処理;
  const handleSubmit = async () => {
    validateSearchValues();
    const hasError = hasErrorMessages(errorMessages);
    if (hasError) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults(setOriginGeocode, originAddress, targetKeywords, radius);
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
