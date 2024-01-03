import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ResultItemDurationProps = {
  nearestPlace: {
    duration: string;
  };
};

const ResultItemDuration = ({ nearestPlace }: ResultItemDurationProps) => {
  const { duration } = nearestPlace;

  return (
    <li>
      <span className="rating-icon">
        <FontAwesomeIcon icon={faClock as IconProp} />
      </span>
      <span>所要時間(徒歩) : </span>
      <span>{duration}</span>
    </li>
  );
};

export default ResultItemDuration;
