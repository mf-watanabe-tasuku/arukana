const inputOrigin = (props) => {
  return (
    <input
      type="text"
      id={props.id}
      onChange={props.onChange}
      value={props.value}
    />
  );
};

export default inputOrigin;
