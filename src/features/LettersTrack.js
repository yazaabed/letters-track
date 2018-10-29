import { Range, Input, Button, Track } from "../components/";

export default class LettersTrack {
  constructor() {
    this.state = {
      range: 0,
      letter: "",
      error: "",
      tracks: []
    };

    this.container = document.createElement("div");
    this.firstTimeRender = true;
    this.trackContainer = new Track();
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  validateInput(buttonName) {
    let newState = {
      error: ""
    };

    if (!this.state.letter) {
      newState["error"] = "required";
    } else if (!/[A-Za-z]{1}/.test(this.state.letter)) {
      newState["error"] = "invalid-pattern";
    } else if (
      this.state.tracks.indexOf(this.state.letter) === -1 &&
      buttonName === "stop"
    ) {
      newState["error"] = "item-not-found";
    }

    this.setState(newState);
    return !newState["error"];
  }

  onGoClicked() {
    if (this.validateInput("go")) {
      const char = this.state.letter;
      const letter = this.state.tracks.find(track => track === char);

      if (!letter) {
        this.setState({
          tracks: [...this.state.tracks, this.state.letter]
        });
      }

      const speed = parseInt(this.state.range);

      this.trackContainer.letter(char).speed(char, speed);

      if (!letter) {
        this.trackContainer.direction(
          char,
          this.trackContainer.DIRECTIONS.RIGHT
        );
      }

      this.trackContainer.start(char);
    }
  }

  onStopClicked() {
    if (this.validateInput("stop")) {
      this.setState({
        tracks: this.state.tracks.filter(track => track !== this.state.letter)
      });

      const char = this.state.letter;

      this.trackContainer.remove(char);
    }
  }

  render(forceRerender) {
    const track = this.trackContainer.render(forceRerender);

    const inputElement = Input({
      containerClassName: "letter-input-container",
      onChange: event => {
        let newState = {};
        newState["letter"] = event.value;
        newState["error"] = "";

        if (!/[A-Za-z]{1}/.test(event.value)) {
          newState["error"] = "invalid-pattern";
        }

        this.setState(newState);
      },
      value: this.state.letter,
      label: "Letter",
      id: "letter",
      style: {
        margin: "0 0 10px 0"
      },
      className: "letter-input",
      maxLength: 1,
      error: this.state.error
    });

    const rangeElement = Range({
      containerClassName: "range-container",
      onChange: event => {
        this.setState({
          range: event.value
        });
      },
      min: 0,
      max: 10,
      value: this.state.range,
      step: 1,
      label: "Speed " + this.state.range,
      id: "range",
      style: {
        margin: "0 0 10px 0"
      },
      className: "range-input"
    });

    if (forceRerender) {
      const goButton = Button({
        id: "go-button",
        onClick: () => {
          this.onGoClicked();
        },
        text: "GO!"
      });

      const stopButton = Button({
        id: "stop-button",
        onClick: () => {
          this.onStopClicked();
        },
        text: "STOP"
      });

      this.container.appendChild(track);

      const inputsContainer = document.createElement("div");
      inputsContainer.appendChild(inputElement);
      inputsContainer.appendChild(rangeElement);
      inputsContainer.className = "inputs-container clearfix";
      this.container.appendChild(inputsContainer);

      const actionsContainer = document.createElement("div");
      actionsContainer.className = "actions-container";
      actionsContainer.appendChild(goButton);
      actionsContainer.appendChild(stopButton);
      this.container.appendChild(actionsContainer);
    }

    return this.container;
  }
}
