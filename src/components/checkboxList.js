import React from "react";
import CheckboxItem from "./checkboxItem";
import "../styles/CheckboxList.css";

const checkboxList = (props) => {
  const placeList = [
    { name: "checkbox1", value: "スターバックス", id: "starbucks" },
    { name: "checkbox2", value: "タリーズ", id: "tullys" },
    { name: "checkbox3", value: "ドトール", id: "doutor" },
    { name: "checkbox4", value: "ジム", id: "gym" },
    { name: "checkbox5", value: "郵便局", id: "postoffice" },
  ];

  return (
    <ul className="place__checkbox-list">
      {placeList.length > 0 &&
        placeList.map((place) => (
          <CheckboxItem
            key={place.id}
            name={place.name}
            value={place.value}
            id={place.id}
            onChange={props.onChange}
          />
        ))}
    </ul>
  );
};

export default checkboxList;
