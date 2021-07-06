import ResultList from "./resultList";
import BackToTopBtn from "./backToTopBtn";

const resultHeader = ({
  originAddress,
  radius,
  originGeocode,
  places,
  handleBackToTop,
}) => {
  return (
    <>
      <p className="search-results__origin-text">
        「{originAddress}」から半径
        {radius || process.env.REACT_APP_DEFAULT_SEARCH_RADIUS}
        m以内の検索結果
      </p>
      <div className="search-results__back-box">
        <p className="search-results__back-link" onClick={handleBackToTop}>
          トップへ戻る
        </p>
      </div>
      <ResultList originGeocode={originGeocode} places={places} />
      <BackToTopBtn onClick={handleBackToTop} />
    </>
  );
};

export default resultHeader;
