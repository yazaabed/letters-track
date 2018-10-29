let pElement;
let Range;
let container;

export default props => {
  container = container || document.createElement("div");
  container.className = props.containerClassName;
  Range = Range || document.createElement("input");

  pElement = pElement || document.createElement("p");
  pElement.innerText = props.label;
  pElement.id = `${props.id}-continer-par`;

  if (!container.querySelector(`#${props.id}-continer-par`)) {
    container.appendChild(pElement);
  }

  Range.style = props.style;
  Range.className = props.className;
  Range.max = props.max;
  Range.min = props.min;
  Range.step = props.step;
  Range.type = "range";
  Range.value = props.value;
  Range.id = props.id;

  Range.oninput = function() {
    props.onChange &&
      props.onChange({
        type: "range",
        value: this.value
      });
  };

  if (!container.querySelector(`#${props.id}`)) {
    container.appendChild(Range);
  }

  return container;
};
