import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResultItemDuration = ({ nearestPlace }) => {
  const { duration } = nearestPlace;

  return (
    <li>
      <span className="rating-icon">
        <FontAwesomeIcon icon={faClock} />
      </span>
      <span>所要時間(徒歩) : </span>
      <span>{duration}</span>
    </li>
  );
};

export default ResultItemDuration;
