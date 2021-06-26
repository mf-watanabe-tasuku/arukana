import "../styles/BackToTopBtn.css";

const searchBtn = ({ onClick }) => {
  return (
    <button className="btn-back" onClick={onClick}>
      トップへ戻る
    </button>
  );
};

export default searchBtn;
