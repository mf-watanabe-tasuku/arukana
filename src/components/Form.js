import { useContext } from 'react';
import Loading from './Loading';
import CheckboxList from './CheckboxList';
import Results from './Results';
import ResultContext from '../context/result/ResultContext';
import SearchContext from '../context/search/SearchContext';
import ErrorMessage from './ErrorMessage';

const Form = () => {
  const resultContext = useContext(ResultContext);
  const { loading, results, setResults, clearResults, setLoading } =
    resultContext;
  const searchContext = useContext(SearchContext);
  const {
    originAddress,
    originGeocode,
    freeKeyword,
    freeKeywords,
    radius,
    recommendChecks,
    errorMessages,
    setOriginAddress,
    setFreeKeyword,
    addFreeKeywords,
    handleCheckboxChange,
    removeFreeKeyword,
    validateSearchValues,
    handleInputRadius,
    getSearchResults
  } = searchContext;

  const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS.toLocaleString();
  const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS.toLocaleString();

  // 検索ボタンを押した時の処理;
  const handleSearch = async (e) => {
    if (e.key === 'Enter') return;
    e.preventDefault();

    const validationErrors = validateSearchValues();
    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);
    const results = await getSearchResults();
    setResults(results);
    setLoading(false);
    window.scrollTo(0, 0);
  };

  return results.length > 0 ? (
    <>
      <p className='search-results__origin-text'>
        「{originAddress}」から半径{radius}m以内の検索結果
      </p>
      <>
        <div className='search-results__back-box'>
          <p className='search-results__back-link' onClick={clearResults}>
            トップへ戻る
          </p>
        </div>
        <Results results={results} originGeocode={originGeocode} />
        <button className='btn-back' onClick={clearResults}>
          トップへ戻る
        </button>
      </>
    </>
  ) : loading ? (
    <Loading />
  ) : (
    <form>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP1</span>
        <p className='search-step__ttl'>調べたい住所を入力</p>
        <input
          className='search-step__input input-origin'
          type='text'
          onChange={(e) => setOriginAddress(e.target.value)}
          value={originAddress}
        />
        <ErrorMessage message={errorMessages.originAddress} />
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP2</span>
        <p className='search-step__ttl'>検索したい施設を選ぶ</p>
        <p className='search-step__sub-ttl'>選択肢から選ぶ</p>
        <CheckboxList
          recommendChecks={recommendChecks}
          onChange={handleCheckboxChange}
        />
        <p className='search-step__sub-ttl'>
          自由に入力する (最大{process.env.REACT_APP_KEYWORD_MAX_COUNT}個)
        </p>
        <input
          type='text'
          className='search-step__input input-keyword'
          placeholder='入力してEnterを押してください  例) セブンイレブン'
          onChange={(e) => setFreeKeyword(e.target.value)}
          onKeyPress={addFreeKeywords}
          value={freeKeyword}
        />
        <ul className='freeKeyword-list'>
          {freeKeywords.map((keyword, i) => (
            <li key={i} className='freeKeyword-item'>
              {keyword}{' '}
              <span
                className='freeKeyword-close-btn'
                onClick={() => removeFreeKeyword(keyword)}
              >
                ×
              </span>
            </li>
          ))}
        </ul>
        <ErrorMessage message={errorMessages.keyword} />
      </div>
      <div className='search-step__item input-wrap'>
        <span className='search-step__num'>STEP3</span>
        <p className='search-step__ttl'>検索する半径距離</p>
        <input
          type='text'
          className='search-step__input input-radius'
          onChange={handleInputRadius}
          value={radius}
        />
        <span className='search-step__unit'>m</span>
        <span className='search-step__range'>
          ({formattedMinRadius} ~ {formattedMaxRadius}m)
        </span>
        <ErrorMessage message={errorMessages.radius} />
      </div>
      <button onClick={handleSearch} type='button' className='btn-search'>
        検索する
      </button>
      <ErrorMessage message={errorMessages.notice} className='text-center' />
    </form>
  );
};

export default Form;
