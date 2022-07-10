import { useContext } from 'react';
import SearchContext from '../context/search/SearchContext';
import '../styles/RecommendChecks.css';

const RecommendChecks = () => {
  const { recommendChecks, handleCheckboxChange } = useContext(SearchContext);

  const placeList = [
    { name: 'checkbox1', value: 'スターバックス', id: 'starbucks' },
    { name: 'checkbox2', value: 'タリーズ', id: 'tullys' },
    { name: 'checkbox3', value: 'コンビニ', id: 'conveniencestore' },
    { name: 'checkbox4', value: 'ジム', id: 'gym' },
  ];

  return (
    <ul className='place__checkbox-list'>
      {placeList.length > 0 &&
        placeList.map((place, i) => {
          return (
            <li className='place-checkbox__item' key={i}>
              <input
                type='checkbox'
                className='place-checkbox__input'
                name={place.name}
                value={place.value}
                id={place.id}
                onChange={handleCheckboxChange}
                defaultChecked={recommendChecks[placeList[i].name]}
              />
              <label className='place-checkbox__label' htmlFor={place.id}>
                {place.value}
              </label>
            </li>
          );
        })}
    </ul>
  );
};

export default RecommendChecks;
