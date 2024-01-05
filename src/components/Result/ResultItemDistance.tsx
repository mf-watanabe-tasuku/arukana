import type { ResultItemProps } from './ResultItem';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResultItemDistance: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;
  const { distance } = nearestPlace;

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance: number) => {
    let distanceWithUnit = '';

    if (distance >= 1000) {
      distanceWithUnit = (distance / 1000).toFixed(1) + 'km';
    } else {
      distanceWithUnit += 'm';
    }

    return distanceWithUnit;
  };

  return (
    <li>
      <span className="rating-icon">
        <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} />
      </span>
      <span>距離 : </span>
      <span>{getDisplayDistance(distance)}</span>
    </li>
  );
};

export default ResultItemDistance;
