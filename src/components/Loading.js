import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className='spinner-case'>
      <FontAwesomeIcon className='spinner-icon' icon={faSpinner} />
      <p className='spinner-text'>検索中です...</p>
    </div>
  );
};

export default Loading;
