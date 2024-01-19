import { styled } from 'styled-components';
import type { KeyboardEvent, RemoveFreeKeyword } from '../../types';
import { useForm } from '../../context/FormContext';

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
    typingKeyword,
    freeKeywords,
    targetKeywords,
    setTypingKeyword,
    setFreeKeywords,
    setTargetKeywords,
    errorMessages,
    setErrorMessages
  } = useForm();

  const addFreeKeywords: KeyboardEvent = e => {
    if (e.key !== 'Enter') return;

    const keywordMaxCount = Number(process.env.REACT_APP_KEYWORD_MAX_COUNT);

    if (keywordMaxCount && freeKeywords.length + 1 > keywordMaxCount) {
      setErrorMessages({
        ...errorMessages,
        keyword: `一度に入力できるのは${keywordMaxCount}個までです`,
      });
      return;
    }

    const targetValue = e.currentTarget.value.trim();
    if (freeKeywords.indexOf(targetValue) === -1) {
      setErrorMessages(delete errorMessages.keyword);
    } else {
      setErrorMessages({
        ...errorMessages,
        keyword: `${targetValue}はすでに入力済みです`,
      });
      return;
    }

    if (targetValue) {
      setTargetKeywords([...targetKeywords, typingKeyword]);
      setFreeKeywords([...freeKeywords, typingKeyword]);
      setTypingKeyword('');
    }
  };

  const removeFreeKeyword: RemoveFreeKeyword = keyword => {
    const keywordIndex = freeKeywords.indexOf(keyword);
    if (keywordIndex === -1) return;
    freeKeywords.splice(keywordIndex, 1);
    setFreeKeywords([...freeKeywords]);

    const targetKeywordsIndex = targetKeywords.indexOf(keyword);
    if (targetKeywordsIndex === -1) return;
    targetKeywords.splice(targetKeywordsIndex, 1);
    setTargetKeywords([...targetKeywords]);
  };

  const placeholderValue = '入力してEnterを押してください  例) セブンイレブン';

  return(
    <>
      <StyledSearchStepSubTitle>
        自由に入力する (最大{process.env.REACT_APP_KEYWORD_MAX_COUNT}個)
      </StyledSearchStepSubTitle>
      <StyledSearchStepInput
        type='text'
        placeholder={placeholderValue}
        onChange={e => setTypingKeyword(e.target.value)}
        onKeyDown={e => addFreeKeywords(e)}
        value={typingKeyword}
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
