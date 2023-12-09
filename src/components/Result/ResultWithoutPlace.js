import { styled } from 'styled-components';

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

const ResultWithoutPlace = ({ places }) => {
  return (
    <StyledNoResults>
      <StyledResultList>
        {places.map((place, i) => (
          <li key={i}>{place.keyword}は見つかりませんでした</li>
        ))}
      </StyledResultList>
    </StyledNoResults>
  );
};

export default ResultWithoutPlace;
