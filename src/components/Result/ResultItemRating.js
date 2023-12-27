import { styled } from 'styled-components';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import star_100 from '../../images/star_100.svg';
import star_75 from '../../images/star_75.svg';
import star_50 from '../../images/star_50.svg';
import star_25 from '../../images/star_25.svg';
import star_0 from '../../images/star_0.svg';

const StyledRatingBox = styled.div`
  display: flex;
  align-items: center;
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

const ResultItemRating = ({ nearestPlace }) => {
  const { rating, reviewCount } = nearestPlace;

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
    <li>
      <StyledRatingBox>
        <span className="rating-icon">
          <FontAwesomeIcon icon={faSmile} />
        </span>
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
        ) : 'まだ評価がありません'}
      </StyledRatingBox>
    </li>
  );
};

export default ResultItemRating;
