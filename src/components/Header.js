import "../styles/Header.css";

const Header = () => {
  return (
    <header>
      <h1 className="header__ttl">ARUKANA</h1>
      <p className="header__desc">
        周辺施設までの距離を一括検索
        <br className="header__br" />
        できるサービスです。
        <br />
        引っ越しや旅行にお役立てください。
      </p>
    </header>
  );
};

export default Header;
