import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { ResultItemProps } from '../../types';
import SearchContext from '../../context/search/SearchContext';

const ResultItemDistance: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;
  const { distance } = nearestPlace;

  const { formatDistanceWithUnit } = useContext(SearchContext);

  return (
    <li>
      <span className="rating-icon">
        <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} />
      </span>
      <span>距離 : </span>
      <span>{formatDistanceWithUnit(distance)}</span>
    </li>
  );
};

export default ResultItemDistance;
