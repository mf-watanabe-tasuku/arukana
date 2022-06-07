import React, { useState, useContext } from 'react';
import RecommendChecks from './RecommendChecks';
import ResultContext from '../context/result/ResultContext';
import SearchContext from '../context/search/SearchContext';
import ErrorMessage from './ErrorMessage';
import Loading from './Loading';

function Form() {
  const [loading, setLoading] = useState(false);

  const { setResults } = useContext(ResultContext);
  const {
    originAddress,
    freeKeyword,
    freeKeywords,
    radius,
    errorMessages,
    setOriginAddress,
    setFreeKeyword,
    addFreeKeywords,
    removeFreeKeyword,
    validateSearchValues,
    handleInputRadius,
    getSearchResults,
  } = useContext(SearchContext);

  const formattedMaxRadius = process.env.REACT_APP_MAX_RADIUS?.toLocaleString();
  const formattedMinRadius = process.env.REACT_APP_MIN_RADIUS?.toLocaleString();

  // 検索ボタンを押した時の処理;
  const handleSubmit = async (e: any) => {
    if (e.key === 'Enter') return;
    e.preventDefault();

    const validationErrors = validateSearchValues();
    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);
    window.scrollTo(0, 0);
    const results = await getSearchResults();
    setResults(results);
  };

  return (
    <>
      {loading ? (
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
            <RecommendChecks />
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
              {freeKeywords.map((keyword: string, i: number) => (
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
          <button onClick={handleSubmit} type='button' className='btn-search'>
            検索する
          </button>
          <div className="text-center">
            <ErrorMessage message={errorMessages.notice} />
          </div>
        </form>
      )}
    </>
  );
}

export default Form;
