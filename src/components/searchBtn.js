import "../styles/SearchBtn.css";

const searchBtn = ({ onClick }) => {
  return (
    <button className="btn-search" onClick={onClick}>
      検索する
    </button>
  );
};

export default searchBtn;
