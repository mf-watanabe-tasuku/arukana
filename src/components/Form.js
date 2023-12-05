import { useState, useContext } from 'react';
import { styled } from 'styled-components';
import RecommendChecks from './RecommendChecks';
import ResultContext from '../context/result/ResultContext';
import SearchContext from '../context/search/SearchContext';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

const StyledSearchForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const StyledSearchStepItem = styled.div`
  background-color: #fff;
  padding: 20px 25px;
  border-radius: 5px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 424px) {
    padding: 20px 15px 15px;
  }
`;

const StyledSeachStepNum = styled.span`
  color: #999999;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
`;

const StyledSearchStepTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 1.2;

  @media (max-width: 424px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`

const StyledSearchStepSubTitle = styled.p`
  color: #666;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`;

const StyledSearchStepInput = styled.input`
  font-size: 18px;
  padding: 15px;
  border: 1px solid #b1b1b1;
  width: 100%;
  border-radius: 5px;
  margin-bottom: 5px;

  @media (max-width: 424px) {
    padding: 10px;
  }

  &::placeholder {
    color: #bbb;
    font-size: 14px;

    @media (max-width: 767px) {
      font-size: 13px;
    }
  }

  &.input-radius {
    width: 150px;
    margin-right: 8px;

    @media (max-width: 767px) {
      width: 130px;
    }
  }
`;

const StyledSearchStepUnit = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`;

const StyledSearchStepRange = styled.span`
  font-size: 14px;
  color: #999;
`;

const StyledFreeKeywordList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin-top: 8px;
`;

const StyledFreeKeywordItem = styled.li`
  color: #fff;
  border: 2px solid #0077c3;
  border-radius: 100px;
  background: #33aaee;
  margin-right: 7px;
  margin-bottom: 7px;
  padding: 3px 9px 3px 16px;
`;

const StyledFreeKeywordCloseBtn = styled.span`
  margin-left: 2px;
  color: #fff;
  cursor: pointer;
`;

const StyledBtnSearch = styled.button`
  width: 300px;
  max-width: 100%;
  padding: 12px 0;
  text-align: center;
  color: #fff;
  font-size: 18px;
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

const StyledTextCenter = styled.div`
  text-align: center;
`;

const Form = () => {
  const [loading, setLoading] = useState(false);

  const { setResults } = useContext(ResultContext);
  const {
    originAddress,
    freeKeyword,
    freeKeywords,
    radius,
    errorMessages,
    setOriginAddress,
    setFreeKeyword,
    addFreeKeywords,
    removeFreeKeyword,
    validateSearchValues,
    handleInputRadius,
    getSearchResults,
  } = useContext(SearchContext);

  const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS?.toLocaleString();
  const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS?.toLocaleString();

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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <StyledSearchForm>
          <StyledSearchStepItem>
            <StyledSeachStepNum>STEP1</StyledSeachStepNum>
            <StyledSearchStepTitle>調べたい住所を入力</StyledSearchStepTitle>
            <StyledSearchStepInput
              type='text'
              onChange={(e) => setOriginAddress(e.target.value)}
              value={originAddress}
            />
            <ErrorMessage message={errorMessages.originAddress} />
          </StyledSearchStepItem>
          <StyledSearchStepItem>
            <StyledSeachStepNum>STEP2</StyledSeachStepNum>
            <StyledSearchStepTitle>検索したい施設を選ぶ</StyledSearchStepTitle>
            <StyledSearchStepSubTitle>選択肢から選ぶ</StyledSearchStepSubTitle>
            <RecommendChecks />
            <StyledSearchStepSubTitle>
              自由に入力する (最大{process.env.REACT_APP_KEYWORD_MAX_COUNT}個)
            </StyledSearchStepSubTitle>
            <StyledSearchStepInput
              type='text'
              placeholder='入力してEnterを押してください  例) セブンイレブン'
              onChange={(e) => setFreeKeyword(e.target.value)}
              onKeyPress={addFreeKeywords}
              value={freeKeyword}
            />
            <StyledFreeKeywordList>
              {freeKeywords.map((keyword, i) => (
                <StyledFreeKeywordItem key={i}>
                  {keyword}{' '}
                  <StyledFreeKeywordCloseBtn onClick={() => removeFreeKeyword(keyword)}>
                    ×
                  </StyledFreeKeywordCloseBtn>
                </StyledFreeKeywordItem>
              ))}
            </StyledFreeKeywordList>
            <ErrorMessage message={errorMessages.keyword} />
          </StyledSearchStepItem>
          <StyledSearchStepItem>
            <StyledSeachStepNum>STEP3</StyledSeachStepNum>
            <StyledSearchStepTitle>検索する半径距離</StyledSearchStepTitle>
            <StyledSearchStepInput
              type='text'
              className='input-radius'
              onChange={handleInputRadius}
              value={radius}
            />
            <StyledSearchStepUnit>m</StyledSearchStepUnit>
            <StyledSearchStepRange>
              ({formattedMinRadius} ~ {formattedMaxRadius}m)
            </StyledSearchStepRange>
            <ErrorMessage message={errorMessages.radius} />
          </StyledSearchStepItem>
          <StyledBtnSearch type='button' onClick={handleSubmit}>
            検索する
          </StyledBtnSearch>
          <StyledTextCenter>
            <ErrorMessage message={errorMessages.notice} />
          </StyledTextCenter>
        </StyledSearchForm>
      )}
    </>
  );
}

export default Form;
