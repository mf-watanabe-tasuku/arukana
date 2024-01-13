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
  const { radius, setRadius, errorMessages, setErrorMessages } = useContext(SearchContext);

  const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS?.toLocaleString();
  const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS?.toLocaleString();

  /**
   * 半径距離が入力された際の処理
   * @param [React.ChangeEventHandler<HTMLInputElement>] e - イベントオブジェクト
   * @returns [void]
   */
  const handleInputRadius: React.ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();

    // errorMessages stateを変数にコピー
    let errorMessagesTemp = {...errorMessages};

    // 半径距離に0から9までの数字およびピリオド以外が含まれている場合はエラー
    const inputRadius = e.target.value;
    if (inputRadius.match(/[^0-9\.]+/)) {
      errorMessagesTemp = {
        ...errorMessagesTemp,
        radius: '半角数字で入力してください'
      };
    // 半径距離にピリオドが複数含まれている場合はエラー
    } else if (inputRadius.match(/\..*\./)) {
      errorMessagesTemp = {
        ...errorMessagesTemp,
        radius: '整数か小数で入力してください'
      };
    // 入力された半径距離に問題がない場合は、errorMessages stateからradiusプロパティを削除
    } else {
      delete errorMessagesTemp.radius;
    }

    // stateの更新
    setErrorMessages(errorMessagesTemp);
    setRadius(inputRadius);
  }

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
