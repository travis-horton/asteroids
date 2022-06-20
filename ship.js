import rotate from './rotate';
import Keyboarder from './keyboarder';

function max2(v) {
  const newV = { x: 0, y: 0 };
  if (vLength(v) > 2) {
    newV.x = v.x / (vLength(v) / 2);
    newV.y = v.y / (vLength(v) / 2);
  }
  return newV;
}

export default class Ship {
  constructor(lives, color, c, ctx) {
    this.lives = lives;
    this.c = { x: c.width / 2, y: c.height / 2 };
    this.d = 0;
    this.v = { x: 0, y: 0 };
    this.keyboarder = new Keyboarder();
    this.color = color;
    this.ctx = ctx;

    this.keyboarder.listenForKeyState();
  }

  draw() {
    const { x } = this.c;
    const { y } = this.c;
    const { d } = this;

    // Draw isosceles triangle pointing in a direction (out of 360).
    let forwardPoint = { x: 0, y: -10 };
    let backLeftPoint = { x: -5, y: 5 };
    let backRightPoint = { x: 5, y: 5 };
    let backwardPoint = { x: 0, y: 2 };

    forwardPoint = rotate(forwardPoint, d);
    backwardPoint = rotate(backwardPoint, d);
    backLeftPoint = rotate(backLeftPoint, d);
    backRightPoint = rotate(backRightPoint, d);

    this.ctx.beginPath();
    this.ctx.moveTo(x + backLeftPoint.x, y + backLeftPoint.y);
    this.ctx.lineTo(x + forwardPoint.x, y + forwardPoint.y);
    this.ctx.lineTo(x + backRightPoint.x, y + backRightPoint.y);
    this.ctx.lineTo(x + backwardPoint.x, y + backwardPoint.y);
    this.ctx.lineTo(x + backLeftPoint.x, y + backLeftPoint.y);
    this.ctx.strokeStyle = `rgb(${this.color},255,255)`;
    this.ctx.stroke();
  }

  update() {
    const { x } = this.c;
    const { y } = this.c;
    // if the right/left keys are down, increase/decrease this.d
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
      this.d -= 4;
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
      this.d += 4;
    }

    // if the up/down keys are down, increase/decrease this.v
    const d = this.d * (Math.PI / 180);

    if (this.keyboarder.isDown(this.keyboarder.KEYS.UP)) {
      this.v.x = this.v.x + (1 / 10) * (Math.sin(d));
      this.v.y = this.v.y + (-1 / 10) * (Math.cos(d));

      if (vLength(this.v) > 2) {
        this.v.x = max2(this.v).x;
        this.v.y = max2(this.v).y;
      }
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
      this.v.x = this.v.x - Math.sign(this.v.x) * 0.02;
      this.v.y = this.v.y - Math.sign(this.v.y) * 0.02;

      if (Math.floor(vLength(this.v)) === 0) {
        this.v.x = 0;
        this.v.y = 0;
      }

      if (vLength(this.v) > 2) {
        this.v.x = max2(this.v).x;
        this.v.y = max2(this.v).y;
      }
    }

    // add v to this.x and this.y
    this.c.x = this.c.x + this.v.x;
    if (this.c.x > this.c.width) { this.c.x = 0; }
    if (this.c.x < 0) { this.c.x = this.c.width; }
    this.c.y = this.c.y + this.v.y;
    if (this.c.y > this.c.height) { this.c.y = 0; }
    if (this.c.y < 0) { this.c.y = this.c.height; }

    // bullets!
    const bulletCenter = { x, y };
    if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
      const bullets = entities.reduce((tot, cur) => {
        if (cur instanceof Bullet) { return tot + 1; } return tot;
      }, 0);
      if (this.color === 0) {
        entities.push(new Bullet(d, bulletCenter));
      } else if (bullets < 40) {
        entities.push(new Bullet(d, bulletCenter));
      }
    }

    const asteroids = entities.reduce((tot, cur) => {
      if (cur instanceof Asteroid) { return tot + 1; } return tot;
    }, 0);
    if (asteroids < 1) { this.color = Math.max(this.color - 90, 0); }
  }

  ifCollision(array, i) {
    const x = this.lives - 1;
    array.splice(0, 1);
    if (x > 0) {
      entities.unshift(new Ship(x, c));
    }
    const point = { x: this.c.x, y: this.c.y };

    makeExplosion(point);
  }
}
