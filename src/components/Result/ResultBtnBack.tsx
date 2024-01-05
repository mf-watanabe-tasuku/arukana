import { useContext } from 'react';
import { styled } from 'styled-components';
import ResultContext from '../../context/result/ResultContext';

const StyledBtnBack = styled.button`
  width: 300px;
  padding: 12px 0;
  text-align: center;
  color: #555;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #ccc;
  box-shadow: 0 6px 0 #777;
  border: none;
  border-radius: 5px;
  margin: 50px auto 0;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;

const Results: React.FC = () => {
  const { clearResults } = useContext(ResultContext);

  return (
    <StyledBtnBack onClick={clearResults}>
      トップへ戻る
    </StyledBtnBack>
  );
};

export default Results;
