import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-text">
      <h1>Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to='/'>トップページに戻る</Link>
    </div>
  );
};

export default NotFound;
