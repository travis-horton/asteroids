import Keyboarder from './keyboarder';
import Spark from './spark';
import Bullet from '../bullet';
import { getVectorLength, max2, rotate } from '../utils';

export default class Ship {
  constructor(color, canvas, ctx) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.d = 0;
    this.v = { x: 0, y: 0 };
    this.keyboarder = new Keyboarder();
    this.color = color;
    this.ctx = ctx;
    this.explosion = [];

    this.keyboarder.listenForKeyState();
  }

  drawExplosion() {
    for (let i = 0; i < this.explosion.length; i += 1) {
      this.explosion[i].draw();
      this.explosion[i].update(this.explosion);
    }
  }

  draw() {
    const { x, y, d } = this;

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

    this.drawExplosion();
  }

  makeExplosion(point) {
    const sparks = Math.floor((Math.random() * 45) + 20);
    for (let i = 0; i < sparks; i += 1) {
      const d = 360 - (i * (360 / sparks));
      this.explosion.push(new Spark(point, d));
    }
  }

  update({ canvas, numberOfBullets, numberOfAsteroids }) {
    const { x, y } = this;

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
      this.v.x += Math.sin(d) / 10;
      this.v.y += Math.cos(d) / -10;

      if (getVectorLength(this.v) > 2) {
        this.v.x = max2(this.v).x;
        this.v.y = max2(this.v).y;
      }
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.DOWN)) {
      this.v.x -= Math.sign(this.v.x) * 0.02;
      this.v.y -= Math.sign(this.v.y) * 0.02;

      if (Math.floor(getVectorLength(this.v)) === 0) {
        this.v.x = 0;
        this.v.y = 0;
      }

      if (getVectorLength(this.v) > 2) {
        this.v.x = max2(this.v).x;
        this.v.y = max2(this.v).y;
      }
    }

    // add v to this.x and this.y
    this.x += this.v.x;
    if (this.x > canvas.width) { this.x = 0; }
    if (this.x < 0) { this.x = canvas.width; }
    this.y += this.v.y;
    if (this.y > canvas.height) { this.y = 0; }
    if (this.y < 0) { this.y = canvas.height; }

    const entitiesToAdd = [];
    // bullets!
    if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
      if (this.color === 0) {
        entitiesToAdd.push(new Bullet(d, x, y));
      } else if (numberOfBullets < 40) {
        entitiesToAdd.push(new Bullet(d, x, y));
      }
    }

    if (numberOfAsteroids < 1) { this.color = Math.max(this.color - 90, 0); }
    return entitiesToAdd;
  }

  handleCollision() {
    const point = { x: this.x, y: this.y };
    this.makeExplosion(point);
  }
}
