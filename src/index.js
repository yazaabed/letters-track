import LettersTrack from "./features/LettersTrack";

class AppContainer {
  constructor() {
    this.lettersTrack = new LettersTrack();
  }

  render() {
    return this.lettersTrack.render(true);
  }
}

const App = new AppContainer();
document.getElementById("app").appendChild(App.render());
