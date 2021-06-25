import "../styles/CheckboxItem.css";

const checkboxItem = ({ name, value, id, onChange }) => {
  return (
    <li className="place-checkbox__item">
      <input
        type="checkbox"
        className="place-checkbox__input"
        name={name}
        value={value}
        id={id}
        onChange={onChange}
      />
      <label className="place-checkbox__label" htmlFor={id}>
        {value}
      </label>
    </li>
  );
};

export default checkboxItem;
