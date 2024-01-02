import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

const StyledNotFoundText = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
`;

const NotFound = () => {
  return (
    <StyledNotFoundText>
      <h1>Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to='/'>トップページに戻る</Link>
    </StyledNotFoundText>
  );
};

export default NotFound;
