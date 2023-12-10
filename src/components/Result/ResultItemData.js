import { styled } from 'styled-components';
import { faSmile, faMapMarkerAlt, faClock, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ResultItemOtherPlaces from './ResultItemOtherPlaces';
import star_100 from '../../images/star_100.svg';
import star_75 from '../../images/star_75.svg';
import star_50 from '../../images/star_50.svg';
import star_25 from '../../images/star_25.svg';
import star_0 from '../../images/star_0.svg';

const StyledResultItemData = styled.div`
  width: 51%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledResultItemTitle = styled.p`
  margin-bottom: 15px;
  font-size: 20px;
`;

const StyledRatingBox = styled.div`
  display: flex;
  align-items: center;
`;

const StyledRatingIcon = styled.span`
  margin-right: 7px;
  display: inline-block;
  width: 20px;
  text-align: center;
  color: #3795c0;
`;

const StyledRatingNum = styled.span`
  margin-right: 7px;
`;

const StyledRatingStarList = styled.span`
  margin-top: 2px;
`;

const StyledRatingStarItem = styled.img`
  width: 20px;
  margin-right: 3px;
`;

const StyledMetaList = styled.ul`
  margin-bottom: 22px;
  list-style: none;
`;

const ResultItemData = ({ nearestPlace, nearbyPlaces }) => {
  const { name, rating, reviewCount, distance, duration } = nearestPlace;

  // 距離を表示用にフォーマットする
  const getDisplayDistance = (distance) => {
    if (distance >= 1000) {
      distance = (distance / 1000).toFixed(1) + 'km';
    } else {
      distance += 'm';
    }

    return distance;
  };

  const getRatingStars = () => {
    if (!rating) return;

    let ratingStars = [];
    for (let i = 1; i <= rating; i++) {
      ratingStars.push(star_100);
    }

    const remaining = (rating * 10) % 10;
    if (0 < remaining && remaining < 3) {
      ratingStars.push(star_25);
    } else if (3 <= remaining && remaining < 8) {
      ratingStars.push(star_50);
    } else if (8 <= remaining) {
      ratingStars.push(star_75);
    }

    while (ratingStars.length < 5) {
      ratingStars.push(star_0);
    }

    return ratingStars;
  };

  return (
    <>
      {nearestPlace && (
        <StyledResultItemData>
          <StyledResultItemTitle>{name}</StyledResultItemTitle>
          <StyledMetaList>
            <li>
              <StyledRatingBox>
                <StyledRatingIcon>
                  <FontAwesomeIcon icon={faSmile} />
                </StyledRatingIcon>
                {rating ? (
                  <>
                    <StyledRatingNum>{rating}</StyledRatingNum>
                    <StyledRatingStarList>
                      {getRatingStars() &&
                        getRatingStars().map((star, i) => (
                          <StyledRatingStarItem
                            key={i}
                            src={star}
                            alt='Rating Star'
                          />
                        ))}
                    </StyledRatingStarList>
                    <span>({reviewCount})</span>
                  </>
                ) : (
                  'まだ評価がありません'
                )}
              </StyledRatingBox>
            </li>
            <li>
              <StyledRatingIcon>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </StyledRatingIcon>
              <span>距離 : </span>
              <span>{getDisplayDistance(distance)}</span>
            </li>
            <li>
              <StyledRatingIcon>
                <FontAwesomeIcon icon={faClock} />
              </StyledRatingIcon>
              <span>所要時間(徒歩) : </span>
              <span>{duration}</span>
            </li>
          </StyledMetaList>
          <ResultItemOtherPlaces places={nearbyPlaces} />
        </StyledResultItemData>
      )}
    </>
  );
};

export default ResultItemData;
