import firebase from 'firebase/app';
import 'firebase/database';
import rotate from './rotate';
import Keyboarder from './keyboarder';

const firebaseConfig = {
  apiKey: 'AIzaSyCscpQBactVcvFofSuzVDAbOtSwQgK4ykw',
  authDomain: 'asteroids-2fa1b.firebaseapp.com',
  projectId: 'asteroids-2fa1b',
  databaseURL: 'https://asteroids-2fa1b-default-rtdb.firebaseio.com/',
  storageBucket: 'asteroids-2fa1b.appspot.com',
  messagingSenderId: '690833972626',
  appId: '1:690833972626:web:a73cbef8b39969fecff54b',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const renderAsteroidsInElement = (parentContainerId) => {
  const database = firebase.database();

  const c = document.createElement('canvas');
  const canvas = c.getContext('2d');
  c.width = 512;
  c.height = c.width;

  const parentContainer = document.getElementById(parentContainerId);
  parentContainer.append(c);

  function game() {
    const ctx = canvas;
    c.style = 'border: 1pt black solid; background-color: black';
    const AsteroidSize = c.width / 14;

    let score = 0;
    let level = 1;
    const entities = [];
    const explosion = [];
    let highScore = '';

    const highScoreRef = database.ref('highscore');
    highScoreRef.on('value', (snapshot) => {
      const data = snapshot.val();
      highScore = data;
    });

    class Ship {
      constructor(lives, color) {
        this.lives = lives;
        this.c = { x: c.width / 2, y: c.height / 2 };
        this.d = 0;
        this.v = { x: 0, y: 0 };
        this.keyboarder = new Keyboarder();
        this.color = color;

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

        ctx.beginPath();
        ctx.moveTo(x + backLeftPoint.x, y + backLeftPoint.y);
        ctx.lineTo(x + forwardPoint.x, y + forwardPoint.y);
        ctx.lineTo(x + backRightPoint.x, y + backRightPoint.y);
        ctx.lineTo(x + backwardPoint.x, y + backwardPoint.y);
        ctx.lineTo(x + backLeftPoint.x, y + backLeftPoint.y);
        ctx.strokeStyle = `rgb(${this.color},255,255)`;
        ctx.stroke();
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
        if (this.c.x > c.width) { this.c.x = 0; }
        if (this.c.x < 0) { this.c.x = c.width; }
        this.c.y = this.c.y + this.v.y;
        if (this.c.y > c.height) { this.c.y = 0; }
        if (this.c.y < 0) { this.c.y = c.height; }

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

    function collision(array) {
      // if any of these collide with another, do entities[i].ifCollision().
      let removeThese = [];
      for (let i = 0; i < array.length; i += 1) {
        if (array[i] instanceof Asteroid) {
          for (let j = 0; j < array.length; j += 1) {
            // asteroid && bullet
            if (array[j] instanceof Bullet) {
              const pointMinusPoint = {
                x: array[i].x - array[j].c.x,
                y: array[i].y - array[j].c.y,
              };

              if (vLength(pointMinusPoint) <= array[i].r) {
                removeThese.push(i);
                removeThese.push(j);
              }
            }

            // asteroid && ship
            if (array[j] instanceof Ship) {
              const pointMinusPoint = {
                x: array[i].x - array[j].c.x,
                y: array[i].y - array[j].c.y,
              };

              if (vLength(pointMinusPoint) <= 5 + array[i].r) {
                removeThese.push(j);
              }
            }
          }
        }
      }

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      removeThese = removeThese.filter(onlyUnique);

      removeThese = removeThese.sort((a, b) => a - b);

      for (let i = 0; i < removeThese.length; i += 1) {
        const arrayNumber = removeThese[i] - i;
        array[arrayNumber].ifCollision(array, arrayNumber);
      }
    }

    function vLength(v) {
      return Math.sqrt((v.x * v.x) + (v.y * v.y));
    }

    function max2(v) {
      const newV = { x: 0, y: 0 };
      if (vLength(v) > 2) {
        newV.x = v.x / (vLength(v) / 2);
        newV.y = v.y / (vLength(v) / 2);
      }
      return newV;
    }

    function Placement() {
      const midWidth = c.width / 2;
      const midHeight = c.height / 2;
      this.x = Math.random() * c.width;
      if (
        this.x > (midWidth - (AsteroidSize + 10))
        && this.x < (midWidth + (AsteroidSize + 10))
      ) { this.x = 0; }
      this.y = Math.random() * c.height;
      if (
        this.y > (midHeight - (AsteroidSize + 10))
        && this.y < (midHeight + (AsteroidSize + 10))
      ) { this.y = 0; }
    }

    function Bullet(d, c) {
      this.d = d;
      this.c = c;
    }

    function makeExplosion(point) {
      const sparks = Math.floor((Math.random() * 45) + 20);
      for (i = 0; i < sparks; i += 1) {
        const d = 360 - (i * (360 / sparks));
        explosion.push(new Spark(point, d));
      }
    }

    function Spark(point, d) {
      this.point = { ...point };
      const x = Math.floor((Math.random() * 30) + 15);
      this.timeLimit = x;
      this.v = rotate({ x: 0, y: Math.random() * 3 - 4 }, d);
    }

    Spark.prototype = {
      draw() {
        ctx.beginPath();
        ctx.moveTo(this.point.x, this.point.y);
        ctx.lineTo(this.point.x + 2, this.point.y + 2);
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.stroke();
      },
      update() {
        this.point.x += this.v.x;
        this.point.y += this.v.y;
        this.timeLimit--;
        if (this.timeLimit < 0) { explosion.splice(0, 1); }
      },
    };

    Bullet.prototype = {
      draw() {
        const tip = {
          x: this.c.x + (10) * (Math.sin(this.d)),
          y: this.c.y + (-10) * (Math.cos(this.d)),
        };
        ctx.beginPath();
        ctx.moveTo(tip.x, tip.y);
        ctx.lineTo(tip.x + 1, tip.y);
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.stroke();
      },
      update() {
        // move in the direction i was going.
        this.c.x += (5) * (Math.sin(this.d));
        this.c.y = this.c.y + (-5) * (Math.cos(this.d));

        if (this.c.x > c.width
          || this.c.x < 0
          || this.c.y > c.height
          || this.c.y < 0
        ) { entities.splice(entities.indexOf(this), 1); }
      },
      ifCollision(array, j) {
        array.splice(j, 1);
      },
    };

    function Asteroid(r, x, y, v) {
      this.v = v;
      this.x = x;
      this.y = y;
      this.r = r;
      this.d = Math.random() * 360;
      this.s = [{}, {}, {}, {}, {}, {}, {}, {}];

      for (let i = 0; i < this.s.length; i += 2) {
        let add = 0;

        if (i > 0) { add = this.s[i - 1].d; }
        this.s[i] = {
          d: ((Math.random() * 0.0625 + 0.0625)) * 360 + add,
          r: ((Math.random() - 0.5) * this.r / 4) + this.r,
        };
        this.s[i + 1] = {
          d: (((i / 2) + 1) * 0.25 * 360),
          r: ((Math.random() - 0.5) * this.r / 4) + this.r,
        };
      }
      this.s[7].r = r;
    }

    Asteroid.prototype = {
      draw() {
        const { x } = this;
        const { y } = this;
        const { r } = this;
        const { s } = this;
        const { d } = this;
        const side = { x: 0, y: 0 };
        const startPolygon = { x, y: y + r };
        side.x = 0;
        side.y = r;
        ctx.beginPath();
        ctx.moveTo(x, y + r);
        for (i = 0; i < s.length; i += 1) {
          side.x = rotate({ x: 0, y: s[i].r }, s[i].d).x;
          side.y = rotate({ x: 0, y: s[i].r }, s[i].d).y;
          ctx.lineTo(side.x + x, side.y + y);
        }
        ctx.strokeStyle = 'rgb(255,255,255)';
        ctx.stroke();
      },

      update() {
        this.d += Math.random() * 5;
        const vX = this.v.x;
        const vY = this.v.y;
        this.x += vX;
        if (this.x > c.width) { this.x = 0; }
        if (this.x < 0) { this.x = c.width; }
        this.y += vY;
        if (this.y > c.height) { this.y = 0; }
        if (this.y < 0) { this.y = c.height; }
      },

      ifCollision(array, i) {
        score += array[i].r;
        if (score > highScore) highScore = Math.floor(score);
        database.ref('/').set({ highscore: highScore });
        if (array[i].r > 7) {
          for (let j = 0; j < 3; j += 1) {
            const newR = array[i].r / 2;
            const newM = array[i].m * 2;
            const d = 360 - (j * (360 / 3)) - Math.random() * 120;
            const newCenter = {
              x: rotate({ x: 0, y: -30 }, d).x + array[i].x,
              y: rotate({ x: 0, y: -30 }, d).y + array[i].y,
            };
            const velocity = -Math.random() * (Math.sqrt(AsteroidSize / newR * 2));
            const newV = rotate({ x: 0, y: velocity }, d);
            array.push(new Asteroid(newR, newCenter.x, newCenter.y, newV));
          }
        }
        array.splice(i, 1);
      },

    };

    entities.push(new Ship(3, 255));
    for (i = 0; i < level; i += 1) {
      const p = new Placement();
      const newV = { x: Math.random() * 0.5, y: Math.random() * 0.5 };
      entities.push(new Asteroid(AsteroidSize, p.x, p.y, newV));
    }

    function tick() {
      collision(entities);
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.font = '12px helvetica';
      ctx.fillText(`score: ${Math.floor(score)}`, 2, 12);
      ctx.fillText(`level: ${level}`, 2, 36);
      ctx.fillText(`HIGH score: ${highScore}`, 2, c.height - 4);
      if (entities[0].lives === 1) { ctx.fillStyle = 'rgb(255,0,0)'; }
      if (entities[0].lives > 0) {
        ctx.fillText(`lives: ${entities[0].lives}`, 2, 24);
      } else {
        ctx.font = '48px helvetica';
        ctx.fillText('GAME OVER', c.width / 2 - 100, c.height / 2 - 20);
        ctx.fillText(`final score: ${Math.floor(score)}`, c.width / 2 - 200, c.height / 2 - 70);
        ctx.fillText(`level: ${level}`, c.width / 2 - 40, c.height / 2 - 120);
        ctx.font = '10px helvetica';
        ctx.fillText('"R" to restart', c.width / 2 - 80, c.height / 2);
      }
      for (let i = 0; i < entities.length; i += 1) {
        entities[i].draw();
        entities[i].update();
      }
      for (let i = 0; i < explosion.length; i += 1) {
        explosion[i].draw();
        explosion[i].update();
      }
      const asteroids = entities.reduce((tot, cur) => {
        if (cur instanceof Asteroid) { return tot + 1; } return tot;
      }, 0);
      if (asteroids < 1) {
        level += 1;
        for (i = 0; i < level; i += 1) {
          const p = new Placement();
          const newV = { x: Math.random() * 0.5, y: Math.random() * 0.5 };
          entities.push(new Asteroid(AsteroidSize, p.x, p.y, newV));
        }
      }
      window.requestAnimationFrame(tick);
    }

    tick();
  }

  game(canvas);

  window.addEventListener('keypress', (e) => {
    if (e.keyCode === 82) {
      game(canvas);
    }
  });
};

export default renderAsteroidsInElement;
