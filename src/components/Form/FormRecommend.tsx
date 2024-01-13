import { useContext } from 'react';
import FormContext from '../../context/form/FormContext';
import { styled } from 'styled-components';

const StyledPlaceCheckboxList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 15px;
  margin: 0 0 30px;
  list-style-type: none;

  @media (max-width: 767px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StyledPlaceCheckboxItem = styled.li`
  border: 2px solid #36759c;
  background: #fff;
  border-radius: 5px;
  text-align: center;
`;

const StyledPlaceCheckboxInput = styled.input`
  display: none;

  &:checked + label {
    color: #fff;
    background: #50b6f1;
  }
`;

const StyledPlaceCheckboxLabel = styled.label`
  padding: 12px 0;
  display: block;
  transition-duration: 0.2s;
  cursor: pointer;

  @media (max-width: 424px) {
    font-size: 14px;
  }
`;

const FormRecommend: React.FC = () => {
  const { recommendChecks, handleCheckboxChange } = useContext(FormContext);

  const placeList = [
    { name: 'checkbox1', value: 'スターバックス', id: 'starbucks' },
    { name: 'checkbox2', value: 'タリーズ', id: 'tullys' },
    { name: 'checkbox3', value: 'コンビニ', id: 'conveniencestore' },
    { name: 'checkbox4', value: 'ジム', id: 'gym' },
  ];

  return (
    <StyledPlaceCheckboxList>
      {placeList.length > 0 &&
        placeList.map((place, i) => {
          return (
            <StyledPlaceCheckboxItem key={i}>
              <StyledPlaceCheckboxInput
                type='checkbox'
                name={place.name}
                value={place.value}
                id={place.id}
                onChange={handleCheckboxChange}
                defaultChecked={recommendChecks[place.name]}
              />
              <StyledPlaceCheckboxLabel htmlFor={place.id}>
                {place.value}
              </StyledPlaceCheckboxLabel>
            </StyledPlaceCheckboxItem>
          );
        })}
    </StyledPlaceCheckboxList>
  );
};

export default FormRecommend;
