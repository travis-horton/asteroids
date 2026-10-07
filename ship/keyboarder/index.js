export default class Keyboarder {
  constructor() {
    this.keyState = {};
    this.isDown = (keyCode) => this.keyState[keyCode] === true;

    this.KEYS = {
      LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32, R: 82,
    };

    this.handleKeyDown = (e) => {
      this.keyState[e.keyCode] = true;
    };

    this.handleKeyUp = (e) => {
      this.keyState[e.keyCode] = false;
    };
  }

  listenForKeyState() {
    // Listening twice would add the same handlers twice; stop first.
    this.stopListening();
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  stopListening() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keyState = {};
  }
}
