import { rotate } from '../utils';

export default class Asteroid {
  constructor(radius, velocity, x = 0, y = 0) {
    this.velocity = velocity;
    this.x = x;
    this.y = y;
    this.r = radius;
    this.d = Math.random() * 360;
    this.s = [{}, {}, {}, {}, {}, {}, {}, {}];

    for (let i = 0; i < this.s.length; i += 2) {
      let add = 0;

      if (i > 0) { add = this.s[i - 1].d; }
      this.s[i] = {
        d: ((Math.random() * 0.0625 + 0.0625)) * 360 + add,
        r: ((Math.random() - 0.5) * (this.r / 4)) + this.r,
      };
      this.s[i + 1] = {
        d: (((i / 2) + 1) * 0.25 * 360),
        r: ((Math.random() - 0.5) * (this.r / 4)) + this.r,
      };
    }
    this.s[7].r = this.r;
  }

  draw(ctx) {
    const side = { x: 0, y: 0 };
    side.x = 0;
    side.y = this.r;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.r);
    for (let i = 0; i < this.s.length; i += 1) {
      side.x = rotate({ x: 0, y: this.s[i].r }, this.s[i].d).x;
      side.y = rotate({ x: 0, y: this.s[i].r }, this.s[i].d).y;
      ctx.lineTo(side.x + this.x, side.y + this.y);
    }
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.stroke();
  }

  update({ canvas }) {
    const {velocity} = this;
    this.d += Math.random() * 5;
    this.x += velocity.x;
    if (this.x > canvas.width) { this.x = 0; }
    if (this.x < 0) { this.x = canvas.width; }
    this.y += velocity.y;
    if (this.y > canvas.height) { this.y = 0; }
    if (this.y < 0) { this.y = canvas.height; }
  }
}
