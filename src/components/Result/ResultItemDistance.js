import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResultItemDistance = ({ nearestPlace }) => {
  const { distance } = nearestPlace;

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + 'km';
    } else {
      distance += 'm';
    }

    return distance;
  };

  return (
    <li>
      <span className="rating-icon">
        <FontAwesomeIcon icon={faMapMarkerAlt} />
      </span>
      <span>距離 : </span>
      <span>{getDisplayDistance(distance)}</span>
    </li>
  );
};

export default ResultItemDistance;
