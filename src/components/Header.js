import { styled } from 'styled-components';

const StyledHeader = styled.header`
  text-align: center;
`;

const StyledHeaderTitle = styled.h1`
  font-size: 50px;
  font-family: 'Kanit', sans-serif;
  line-height: 1;
  color: #003972;
  margin-bottom: 20px;
`;

const StyledHeaderDesc = styled.p`
  margin-bottom: 50px;
`;

const Header = () => {
  return (
    <StyledHeader>
      <StyledHeaderTitle>ARUKANA</StyledHeaderTitle>
      <StyledHeaderDesc>
        周辺施設までの距離を一括検索
        <br className='show-sp'/>
        できるサービスです。
        <br />
        引っ越しや旅行にお役立てください。
      </StyledHeaderDesc>
    </StyledHeader>
  );
};

export default Header;
