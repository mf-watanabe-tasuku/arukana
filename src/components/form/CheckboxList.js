import CheckboxItem from "./CheckboxItem";
import "../../styles/CheckboxList.css";

const checkboxList = ({ recommendChecks, onChange }) => {
  const placeList = [
    { name: "checkbox1", value: "スターバックス", id: "starbucks" },
    { name: "checkbox2", value: "タリーズ", id: "tullys" },
    { name: "checkbox3", value: "コンビニ", id: "conveniencestore" },
    { name: "checkbox4", value: "ジム", id: "gym" },
  ];

  return (
    <ul className="place__checkbox-list">
      {placeList.length > 0 &&
        placeList.map((place, i) => (
          <CheckboxItem
            key={place.id}
            name={place.name}
            value={place.value}
            id={place.id}
            onChange={onChange}
            checked={recommendChecks[placeList[i].name]}
          />
        ))}
    </ul>
  );
};

export default checkboxList;
