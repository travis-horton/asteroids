export default class Keyboarder {
  constructor() {
    this.keyState = {};
    this.isDown = (keyCode) => this.keyState[keyCode] === true;

    this.KEYS = {
      LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32, R: 82,
    };
  }

  listenForKeyState() {
    window.onkeydown = (e) => {
      this.keyState[e.keyCode] = true;
    };

    window.onkeyup = (e) => {
      this.keyState[e.keyCode] = false;
    };
  }
}
