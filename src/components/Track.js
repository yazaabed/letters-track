export default class Track {
  constructor() {
    this.tracks = [];
    this.queue = [];
    this.container = document.createElement("div");
    this.tracksContainer = document.createElement("div");
    this.tracksContainer.className = "tracks";
    this.started = false;
    this.DIRECTIONS = {
      LEFT: "left",
      RIGHT: "right"
    };
  }

  letter(char) {
    const charDetails = this.tracks.find(track => char === track.value);

    if (!charDetails) {
      this.tracks = [
        ...this.tracks,
        {
          value: char,
          label: char
        }
      ];
    }

    return this;
  }

  direction(char, direction) {
    this.tracks = this.tracks.map(track => {
      if (char === track.value) {
        track.direction = direction;
      }

      return track;
    });

    return this;
  }

  speed(char, speed) {
    this.tracks = this.tracks.map(track => {
      if (char === track.value) {
        track.speed = speed;
      }

      return track;
    });

    return this;
  }

  start(char) {
    const charDetails = this.tracks.find(track => char === track.value);

    if (typeof charDetails.direction === "undefined") {
      throw new Error(`${char} dones't has direction`);
    }

    if (typeof charDetails.speed === "undefined") {
      throw new Error(`${char} dones't has speed`);
    }

    if (!this.started) {
      this.started = true;
      this.interval = setInterval(() => {
        this._animate();
      }, 150);
    }

    this._append(charDetails);
    return this;
  }

  remove(char) {
    const charElement = this.tracks.find(track => track.value === char);
    charElement.element.parentNode.removeChild(charElement.element);
    this.tracks = this.tracks.filter(track => track.value !== char);
    return this;
  }

  _getCharElementId(char) {
    let searchForLetterId = `${char.value}-small-letter`;

    if (char.value === char.value.toUpperCase()) {
      searchForLetterId = `${char.value}-capital-letter`;
    }

    return searchForLetterId;
  }

  _append(char) {
    const searchForLetterId = this._getCharElementId(char);
    const searchForLetter = document.getElementById(searchForLetterId);

    if (!searchForLetter) {
      const letterContainer = document.createElement("span");
      letterContainer.className = "letter-item";
      letterContainer.textContent = char.value;
      letterContainer.id = searchForLetterId;
      letterContainer.style.left =
        (char.direction === this.DIRECTIONS.LEFT
          ? 0
          : this.tracksContainer.offsetWidth - 18) + "px";

      this.tracksContainer.appendChild(letterContainer);

      this.tracks = this.tracks.map(track => {
        if (track.value === char.value) {
          return {
            ...track,
            element: letterContainer,
            startTime: new Date().getTime()
          };
        }

        return track;
      });
    }
  }

  _checkIfCharHitEdges(charElement) {
    const checkIfRightEdge =
      charElement.element.offsetLeft >= this.tracksContainer.offsetWidth - 18;

    const checkIfLeftEdge = charElement.element.offsetLeft <= 5;

    if (checkIfRightEdge || checkIfLeftEdge) {
      switch (charElement.direction) {
        case this.DIRECTIONS.LEFT:
          this.direction(charElement.value, this.DIRECTIONS.RIGHT);
          break;

        case this.DIRECTIONS.RIGHT:
          this.direction(charElement.value, this.DIRECTIONS.LEFT);
          break;
      }
    }
  }

  _calculateCharOverlap() {
    this.tracks = this.tracks.sort((x, y) => x.offsetLeft - y.offsetLeft);

    for (let i = 0; i < this.tracks.length - 1; i++) {
      let track = this.tracks[i];
      let nextTrack = this.tracks[i + 1];
      let elementOffset = track.offsetLeft;
      let nextElementOffset = nextTrack.offsetLeft;
      let diff = nextElementOffset - elementOffset;

      if (diff >= 0 && diff <= 16) {
        if (track.direction !== nextTrack.direction) {
          const newTrack = JSON.parse(JSON.stringify(track));
          this.direction(newTrack.value, nextTrack.direction);
          this.direction(nextTrack.value, newTrack.direction);
        } else if (track.direction === this.DIRECTIONS.LEFT) {
          this.direction(track.value, this.DIRECTIONS.RIGHT);
        } else if (nextTrack.direction === this.DIRECTIONS.RIGHT) {
          this.direction(nextTrack.value, this.DIRECTIONS.LEFT);
        }
      }
    }
  }

  _movePerLetter(charElement) {
    let t = Date.now() - charElement.startTime;
    let newSpeed = Math.abs(10 - charElement.speed) || 1;
    let steps = Math.min(t / charElement.speed, 1);
    let shift;

    switch (charElement.direction) {
      case this.DIRECTIONS.LEFT:
        shift = charElement.element.offsetLeft + steps * 10;
        break;

      case this.DIRECTIONS.RIGHT:
        shift = Math.abs(charElement.element.offsetLeft - steps * 10);
        break;
    }

    if (t > newSpeed * 100) {
      charElement.element.style.left = shift.toFixed(2) + "px";
      charElement.startTime = Date.now();

      // Check if the moving char hit edges
      this._checkIfCharHitEdges(charElement);
    }

    charElement.offsetLeft = shift;
  }

  _move() {
    this.tracks.forEach(track => {
      this._movePerLetter(track);
    });

    this._calculateCharOverlap();
  }

  _animate() {
    this._move();
  }

  render(forceRerender) {
    if (forceRerender) {
      const pElement = document.createElement("p");
      pElement.innerText = "Track";
      this.container.appendChild(pElement);
      this.container.appendChild(this.tracksContainer);
    }

    return this.container;
  }
}
