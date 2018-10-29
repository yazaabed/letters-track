export default props => {
  const button = document.createElement("button");
  button.innerText = props.text;
  button.id = props.id;
  button.style = props.style;
  button.className = props.className;

  button.onclick = function(event) {
    props.onClick && props.onClick();
  };

  return button;
};
