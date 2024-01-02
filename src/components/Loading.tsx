import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from 'styled-components';

const StyledSpinnerCase = styled.div`
  margin-top: 100px;
  text-align: center;
  font-size: 60px;
`;

const StyledSpinnerIcon = styled.div`
  opacity: 0.5;
  animation: rotation 2s infinite linear;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(359deg);
    }
  }
`;

const StyledSpinnerText = styled.p`
  font-size: 18px;
  margin-top: 10px;
`;

const Loading = () => {
  return (
    <StyledSpinnerCase>
      <StyledSpinnerIcon>
        <FontAwesomeIcon icon={faSpinner as IconProp} />
      </StyledSpinnerIcon>
      <StyledSpinnerText>検索中です...</StyledSpinnerText>
    </StyledSpinnerCase>
  );
};

export default Loading;
