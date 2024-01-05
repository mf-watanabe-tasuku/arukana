import { useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../../context/search/SearchContext';

const StyledSearchStepInput = styled.input`
  width: 150px;
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

const StyledSearchStepUnit = styled.span`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`;

const StyledSearchStepRange = styled.span`
  font-size: 14px;
  color: #999;
`;

const FormRadius: React.FC = () => {
  const { radius, handleInputRadius } = useContext(SearchContext);

  const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS?.toLocaleString();
  const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS?.toLocaleString();

  return(
    <>
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
    </>
  )
}


export default FormRadius;
