import "../styles/CheckboxItem.css";

const checkboxItem = ({ name, value, id, onChange }) => {
  return (
    <li className="place__checkbox-item">
      <input
        type="checkbox"
        className="placeCheckbox"
        name={name}
        value={value}
        id={id}
        onChange={onChange}
      />
      <label htmlFor={id}>{value}</label>
    </li>
  );
};

export default checkboxItem;
