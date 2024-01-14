import { styled } from 'styled-components';
import type { ChangeEvent } from '../../types';
import { useForm } from '../../context/FormContext';

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
  const {
    recommendChecks,
    setRecommendChecks,
    targetKeywords,
    setTargetKeywords
  } = useForm();

  const defaultPlaces = [
    { name: 'checkbox1', value: 'スターバックス', id: 'starbucks' },
    { name: 'checkbox2', value: 'タリーズ', id: 'tullys' },
    { name: 'checkbox3', value: 'コンビニ', id: 'conveniencestore' },
    { name: 'checkbox4', value: 'ジム', id: 'gym' },
  ];

  const handleCheckboxChange: ChangeEvent = e => {
    const targetValue = e.target.value;
    const { name, checked } = e.target;
    const keywordIndex = targetKeywords.indexOf(targetValue);

    let newTargetKeywords: string[] | [] = [];
    if (checked && keywordIndex === -1) {
      newTargetKeywords = [...targetKeywords, targetValue]
    }
    if (!checked && keywordIndex > -1) {
      newTargetKeywords = targetKeywords.filter((_, i) => i !== keywordIndex)
    }

    setTargetKeywords(newTargetKeywords);
    setRecommendChecks({...recommendChecks, [name]: checked});
  };

  return (
    <StyledPlaceCheckboxList>
      {defaultPlaces.length > 0 &&
        defaultPlaces.map((place, i) => {
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
