const resultItem = ({ result }) => {
  // 検索結果を表示する
  const displayResult = () => {
    const { keyword, name, distance, duration } = { ...result };
    const formatDistance = getDisplayDistance(distance);

    const hasResultText = `最寄りの${keyword}: <b>${name}</b> ( 距離: ${formatDistance} / 所要時間: ${duration} )`;
    const noResultText = `${keyword}は見つかりませんでした`;

    return { __html: name ? hasResultText : noResultText };
  };

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance /= 1000.0;
      distance = Math.round(distance * 10) / 10.0;
      distance += "km";
    } else {
      distance += "m";
    }

    return distance;
  };

  return <li dangerouslySetInnerHTML={displayResult()}></li>;
};

export default resultItem;
