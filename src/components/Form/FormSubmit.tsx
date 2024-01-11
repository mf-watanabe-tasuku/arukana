import { useContext } from 'react';
import { styled } from 'styled-components';
import type { FormSubmitProps } from '../../types';
import SearchContext from '../../context/search/SearchContext';
import { useResultsDispatch } from '../../context/ResultsContext';
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

const FormSubmit: React.FC<FormSubmitProps> = ({ setLoading }) => {
  const resultsDispatch = useResultsDispatch();
  const {
    originAddress,
    radius,
    targetKeywords,
    setOriginGeocode,
    setErrorMessages,
    validateSearchValues
  } = useContext(SearchContext);

  // 検索ボタンを押した時の処理
  const handleSubmit = async () => {
    // 検索条件のバリデーションを行い、返却された結果をerrorMessages stateにセット
    const validationErrors = validateSearchValues();
    setErrorMessages(validationErrors);

    // エラーがある場合は検索処理を中断
    const hasError = hasErrorMessages(validationErrors);
    if (hasError) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults(setOriginGeocode, originAddress, targetKeywords, radius);

    // 検索結果をResultsContextにセット
    resultsDispatch(results);
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
