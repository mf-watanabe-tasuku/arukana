import { useContext } from 'react';
import { styled } from 'styled-components';
import { HasErrorMessages } from '../../types';
import FormContext from '../../context/form/FormContext';
import { useLoading } from '../../context/LoadingContext';
import { useResults } from '../../context/ResultsContext';
import { getSearchResults } from '../../utils/search';

const StyledBtnSearch = styled.button`
  width: 300px;
  max-width: 100%;
  padding: 12px 0;
  text-align: center;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  background-color: #33aaee;
  box-shadow: 0 6px 0 #006ba3;
  border: none;
  border-radius: 5px;
  margin: 25px auto 15px;
  display: block;
  cursor: pointer;
  transition-duration: 0.3s;

  @media (max-width: 767px) {
    margin-top: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const FormSubmit: React.FC = () => {
  const { setResults } = useResults();
  const { setLoading } = useLoading();
  const {
    originAddress,
    radius,
    targetKeywords,
    setOriginGeocode,
    setRadius,
    setErrorMessages
  } = useContext(FormContext);

  const validateSearchValues = () => {
    const validationErrors = {
      originAddress: '',
      keyword: '',
      radius: ''
    };

    // 基準地点が空の場合はエラー
    if (!originAddress)
      validationErrors.originAddress = '基準地点を入力してください';

    // 検索対象のキーワードが空の場合はエラー
    if (targetKeywords.length === 0)
      validationErrors.keyword = '検索する施設を選択または入力してください';

    // 半径距離が空の場合はエラー
    if (!radius) {
      validationErrors.radius = '検索したい半径距離を入力してください';
    // 半径距離が半角数字以外の場合、または半角数字を含まない場合(ピリオドのみ)はエラー
    } else if (String(radius).match(/[^0-9\.]+/) || !String(radius).match(/[0-9]+/)) {
      validationErrors.radius = '半角数字で入力してください';
    // 半径距離が小数点を複数個含む場合はエラー
    } else if (String(radius).match(/\..*\./)) {
      validationErrors.radius = '整数か小数で入力してください';
    } else {
      // stateに保持している半径距離をStringからFloatに変換
      const radiusInFloat = parseFloat(String(radius));

      const maxRadius = process.env.REACT_APP_MAX_RADIUS;
      const minRadius = process.env.REACT_APP_MIN_RADIUS;

      // 半径距離が最大値より大きい場合はエラーをセット
      if (radiusInFloat > Number(maxRadius)) {
        const formattedMaxRadius = maxRadius?.toLocaleString();
        validationErrors.radius = `半径${formattedMaxRadius}mより大きな値は指定できません`;
      // 半径距離が最小値より小さい場合はエラーをセット
      } else if (radiusInFloat < Number(minRadius)) {
        const formattedMinRadius = minRadius?.toLocaleString();
        validationErrors.radius = `半径${formattedMinRadius}m未満は指定できません`;
      // 半径距離が最大値以下・最小値以上である場合は、radius stateを文字列型の値で更新
      } else {
        setRadius(String(radiusInFloat));
      }
    }

    return validationErrors;
  };

  /**
 * エラーメッセージがあるかどうかを判定する関数
 * @param {object} messages - エラーメッセージ
 * @return {boolean} hasError - エラーメッセージがあるかどうか
 */
  const hasErrorMessages: HasErrorMessages = messages => {
    let hasError = false;

    const errorMessagesInArray = Object.entries(messages);
    errorMessagesInArray.map(([, value]) => {
      if (value) hasError = true;
    });

    return hasError;
  }

  // 検索ボタンを押した時の処理
  const handleSubmit = async () => {
    // 検索条件のバリデーションを行い、返却された結果をerrorMessages stateにセット
    const validationErrors = validateSearchValues();
    setErrorMessages(validationErrors);

    // エラーがある場合は検索処理を中断
    const hasError = hasErrorMessages(validationErrors);
    if (hasError) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults(setOriginGeocode, originAddress, targetKeywords, radius);

    // 検索結果をResultsContextにセット
    setResults(results);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  }

  return(
    <StyledBtnSearch type='button' onClick={handleSubmit} onKeyDown={handleKeyDown}>
      検索する
    </StyledBtnSearch>
  )
}


export default FormSubmit;
