import { useContext } from 'react';
import { styled } from 'styled-components';
import type { ResultProps } from '../../types';
import ResultContext from '../../context/result/ResultContext';

const StyledNoResults = styled.div`
  margin-bottom: 40px;
  border: 2px solid tomato;
  border-radius: 5px;
  background-color: rgb(255, 194, 194);
  padding: 30px 30px 30px 50px;
`;

const StyledResultList = styled.ul`
  line-height: 2.2;
`;

const ResultWithoutPlace: React.FC = () => {
  const { resultsWithoutPlace } = useContext(ResultContext);

  return (
    <>
      {resultsWithoutPlace.length > 0 && (
        <StyledNoResults>
          <StyledResultList>
            {resultsWithoutPlace.map((result: ResultProps, i: number) => (
              <li key={i}>{result.keyword}は見つかりませんでした</li>
            ))}
          </StyledResultList>
        </StyledNoResults>
      )}
    </>
  );
};

export default ResultWithoutPlace;
