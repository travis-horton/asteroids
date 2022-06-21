export default class Bullet {
  constructor(d, x, y) {
    this.d = d;
    this.x = x;
    this.y = y;
  }

  draw(ctx) {
    const tip = {
      x: this.x + (10) * (Math.sin(this.d)),
      y: this.y + (-10) * (Math.cos(this.d)),
    };
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(tip.x + 1, tip.y);
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.stroke();
  }

  update() {
    // move in the direction i was going.
    this.x += 5 * Math.sin(this.d);
    this.y += -5 * Math.cos(this.d);
  }
}
