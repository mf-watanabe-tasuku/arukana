import { styled } from 'styled-components';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ResultItemProps } from '../../types';

const StyledRatingIcon = styled.span`
  margin-right: 7px;
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #3795c0;
`;

const ResultItemDuration: React.FC<ResultItemProps> = ({ result }) => {
  const { nearestPlace } = result;
  const { duration } = nearestPlace;

  return (
    <li>
      <StyledRatingIcon>
        <FontAwesomeIcon icon={faClock as IconProp} />
      </StyledRatingIcon>
      <span>所要時間(徒歩) : </span>
      <span>{duration}</span>
    </li>
  );
};

export default ResultItemDuration;
