import { useContext } from 'react';
import { styled } from 'styled-components';
import SearchContext from '../../context/search/SearchContext';

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
`;

const FormAddress = () => {
  const { originAddress, setOriginAddress } = useContext(SearchContext);

  return(
    <StyledSearchStepInput
      type='text'
      onChange={e => setOriginAddress(e.target.value)}
      value={originAddress}
    />
  )
}


export default FormAddress;
