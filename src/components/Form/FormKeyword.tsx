import { useContext } from 'react';
import { styled } from 'styled-components';
import FormContext from '../../context/form/FormContext';

const StyledSearchStepSubTitle = styled.p`
  color: #666;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 14px;
`;

const StyledSearchStepInput = styled.input`
  width: 100%;
  margin-right: 8px;
  font-size: 18px;
  padding: 15px;
  border: 1px solid #b1b1b1;
  margin-bottom: 5px;
  border-radius: 5px;

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

const FormKeyword: React.FC = () => {
  const {
    freeKeyword,
    freeKeywords,
    setFreeKeyword,
    addFreeKeywords,
    removeFreeKeyword
  } = useContext(FormContext);

  return(
    <>
      <StyledSearchStepSubTitle>
        自由に入力する (最大{process.env.REACT_APP_KEYWORD_MAX_COUNT}個)
      </StyledSearchStepSubTitle>
      <StyledSearchStepInput
        type='text'
        placeholder='入力してEnterを押してください  例) セブンイレブン'
        onChange={e => setFreeKeyword(e.target.value)}
        onKeyDown={e => addFreeKeywords(e)}
        value={freeKeyword}
      />
      <StyledFreeKeywordList>
        {freeKeywords.map((keyword: string, i: number) => (
          <StyledFreeKeywordItem key={i}>
            {keyword}{' '}
            <StyledFreeKeywordCloseBtn onClick={() => removeFreeKeyword(keyword)}>
              ×
            </StyledFreeKeywordCloseBtn>
          </StyledFreeKeywordItem>
        ))}
      </StyledFreeKeywordList>
    </>
  )
}


export default FormKeyword;
