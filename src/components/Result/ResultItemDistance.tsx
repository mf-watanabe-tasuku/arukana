import { styled } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { ResultItemProps } from '../../types';
import { formatDistanceWithUnit } from '../../utils/form';

const StyledRatingIcon = styled.span`
  margin-right: 7px;
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #3795c0;
`;

const ResultItemDistance: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;
  const { distance } = nearestPlace;

  return (
    <li>
      <StyledRatingIcon>
        <FontAwesomeIcon icon={faMapMarkerAlt as IconProp} />
      </StyledRatingIcon>
      <span>距離 : </span>
      <span>{formatDistanceWithUnit(distance)}</span>
    </li>
  );
};

export default ResultItemDistance;
