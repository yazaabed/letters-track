let pElement;
let Input;
let container;

export default props => {
  container = container || document.createElement("div");
  container.className = props.containerClassName;
  Input = Input || document.createElement("input");

  if (props.label) {
    pElement = pElement || document.createElement("p");
    pElement.innerText = props.label;
    pElement.id = `${props.id}-continer-par`;

    if (!container.querySelector(`#${props.id}-continer-par`)) {
      container.appendChild(pElement);
    }
  }

  Input.style = props.style;
  Input.className = props.className;
  Input.type = "text";
  Input.value = props.value;
  Input.id = props.id;
  Input.maxLength = props.maxLength;

  Input.oninput = function() {
    props.onChange &&
      props.onChange({
        type: "text",
        value: this.value
      });
  };

  if (!container.querySelector(`#${props.id}`)) {
    container.appendChild(Input);
  }

  const errorId = props.id + "-input-error";
  const errorContainer =
    container.querySelector("#" + errorId) || document.createElement("div");
  errorContainer.id = props.id + "-input-error";
  errorContainer.className = "error";

  if (props.error) {
    switch (props.error) {
      case "invalid-pattern":
        errorContainer.innerHTML = "Allowed small/capital letters";
        break;

      case "required":
        errorContainer.innerHTML = "This field is requried";
        break;

      case "item-not-found":
        errorContainer.innerHTML = "Letter not found";
        break;
    }

    container.appendChild(errorContainer);
  } else if (errorContainer.parentNode) {
    errorContainer.parentNode.removeChild(errorContainer);
  }

  return container;
};
