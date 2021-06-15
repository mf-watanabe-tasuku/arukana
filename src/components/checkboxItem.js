import "../styles/CheckboxItem.css";

const checkboxItem = (props) => {
  const [name, value, id, onChange] = [
    props.name,
    props.value,
    props.id,
    props.onChange,
  ];

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
