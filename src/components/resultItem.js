import "../styles/ResultItem.css";

const resultItem = ({ result }) => {
  const { keyword, nearestPlace, otherPlaces } = result;

  // 検索結果を表示する
  const displayResult = () => {
    const { name, distance, duration } = nearestPlace;
    const formatDistance = getDisplayDistance(distance);

    const hasResultText = `最寄りの${keyword}: <b>${name}</b> ( 距離: ${formatDistance} / 所要時間: ${duration} )`;

    return { __html: hasResultText };
  };

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + "km";
    } else {
      distance += "m";
    }

    return distance;
  };

  return (
    <li className="result-item">
      {nearestPlace ? (
        <p dangerouslySetInnerHTML={displayResult()}></p>
      ) : (
        <p>{keyword}は見つかりませんでした</p>
      )}
      {otherPlaces.length > 0 && (
        <div className="otherResults-box">
          <p className="otherResults-title">検索にヒットした場所</p>
          <ul>
            {otherPlaces.map((place, i) => (
              <li key={i}>
                {place.name} ( 距離: {getDisplayDistance(place.distance)} /
                所要時間: {place.duration} )
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default resultItem;
