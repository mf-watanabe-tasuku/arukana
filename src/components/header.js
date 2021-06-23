import "../styles/Header.css";

const header = () => {
  return (
    <header>
      <h1 className="header__ttl">ARUKANA</h1>
      <p className="header__desc">
        周辺施設までの距離を一括検索できるサービスです
        <br />
        引っ越しや旅行にお役立てください
      </p>
    </header>
  );
};

export default header;
