import firebase from 'firebase/app';
import 'firebase/database';
import Bullet from './bullet';
import Asteroid from './asteroid';
import Ship from './ship';
import { vLength } from './utils';
import rotate from './rotate';

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCscpQBactVcvFofSuzVDAbOtSwQgK4ykw',
  authDomain: 'asteroids-2fa1b.firebaseapp.com',
  projectId: 'asteroids-2fa1b',
  databaseURL: 'https://asteroids-2fa1b-default-rtdb.firebaseio.com/',
  storageBucket: 'asteroids-2fa1b.appspot.com',
  messagingSenderId: '690833972626',
  appId: '1:690833972626:web:a73cbef8b39969fecff54b',
});

const renderAsteroidsInElement = (parentContainerId) => {
  const database = firebase.database();

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 432;
  canvas.height = canvas.width;
  canvas.style = 'border: 1pt black solid; background-color: black';

  const parentContainer = document.getElementById(parentContainerId);
  parentContainer.append(canvas);

  function game() {
    const AsteroidSize = canvas.width / 14;
    let level = 1;
    let lives = 3;
    let score = 0;
    let highScore = '';
    const entities = [];

    const highScoreRef = database.ref('highscore');
    highScoreRef.on('value', (snapshot) => {
      highScore = snapshot.val();
    });

    function getDistanceFromCenters(a, b) {
      return {
        x: a.x - b.x,
        y: a.y - b.y,
      };
    }

    function getCollisions() {
      const entitesThatCollided = [];
      const asteroids = entities.filter((entity) => entity instanceof Asteroid);
      for (let i = 0; i < asteroids.length; i += 1) {
        const asteroid = asteroids[i];
        // asteroid && bullets
        const bullets = entities.filter((entity) => entity instanceof Bullet);
        for (let j = 0; j < bullets.length; j += 1) {
          const bullet = bullets[j];
          const distanceFromCenters = getDistanceFromCenters(
            asteroid,
            bullet,
          );

          if (vLength(distanceFromCenters) <= asteroid.r) {
            entitesThatCollided.push(asteroid);
            entitesThatCollided.push(bullet);
          }
        }

        // asteroid && ship
        const ship = entities.find((entity) => entity instanceof Ship);
        const distanceFromCenters = getDistanceFromCenters(asteroid, ship);

        if (vLength(distanceFromCenters) <= 5 + asteroid.r) {
          entitesThatCollided.push(ship);
        }
      }
      return entitesThatCollided;
    }

    function removeEntity(entity) {
      entities.splice(entities.indexOf(entity), 1);
    }

    function asteroidCanBeSplit(asteroid) {
      return asteroid.r > 7;
    }

    function splitAsteroid(asteroid) {
      for (let j = 0; j < 3; j += 1) {
        const newRadius = asteroid.r / 2;
        const d = 360 - (j * (360 / 3)) - Math.random() * 120;
        const newCenter = {
          x: rotate({ x: 0, y: -30 }, d).x + asteroid.x,
          y: rotate({ x: 0, y: -30 }, d).y + asteroid.y,
        };
        const velocity = (
          -Math.random() * (Math.sqrt(AsteroidSize / (newRadius * 2)))
        );
        const newV = rotate({ x: 0, y: velocity }, d);
        entities.push(new Asteroid(
          newRadius,
          newV,
          newCenter.x,
          newCenter.y,
        ));
      }
    }

    function handleCollisions() {
      const entitesThatCollided = new Set(getCollisions());

      entitesThatCollided.forEach((entity) => {
        if (entity instanceof Asteroid) {
          score += entity.r;
          if (score > highScore) highScore = Math.floor(score);
          if (asteroidCanBeSplit(entity)) {
            splitAsteroid(entity);
          }
        }
        if (entity instanceof Ship) {
          lives -= 1;
          if (lives > 0) {
            entities.unshift(new Ship(255, canvas, ctx));
          }
          entity.handleCollision();
        }
        removeEntity(entity);
      });
    }

    class Placement {
      constructor() {
        this.midWidth = canvas.width / 2;
        this.midHeight = canvas.height / 2;
        this.x = Math.random() * canvas.width;
        if (
          this.x > (this.midWidth - (AsteroidSize + 10))
          && this.x < (this.midWidth + (AsteroidSize + 10))
        ) { this.x = 0; }
        this.y = Math.random() * canvas.height;
        if (
          this.y > (this.midHeight - (AsteroidSize + 10))
          && this.y < (this.midHeight + (AsteroidSize + 10))
        ) { this.y = 0; }
      }
    }

    function drawNewBackground() {
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawGameOverScreen() {
      ctx.font = '48px helvetica';
      ctx.fillText(
        'GAME OVER',
        canvas.width / 2 - 100,
        canvas.height / 2 - 20,
      );
      ctx.fillText(
        `final score: ${Math.floor(score)}`,
        canvas.width / 2 - 200,
        canvas.height / 2 - 70,
      );
      ctx.fillText(
        `level: ${level}`,
        canvas.width / 2 - 40,
        canvas.height / 2 - 120,
      );
      ctx.font = '10px helvetica';
      ctx.fillText(
        '"R" to restart',
        canvas.width / 2 - 80,
        canvas.height / 2,
      );
    }

    function drawInfo() {
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.font = '12px helvetica';
      ctx.fillText(`score: ${Math.floor(score)}`, 2, 12);
      ctx.fillText(`level: ${level}`, 2, 36);
      ctx.fillText(`HIGH score: ${highScore}`, 2, canvas.height - 4);
      // Red text if you're on your last life!
      if (lives === 1) { ctx.fillStyle = 'rgb(255,0,0)'; }

      if (lives > 0) {
        ctx.fillText(`lives: ${lives}`, 2, 24);
      } else {
        drawGameOverScreen();
      }
    }

    function isOffTheBoard(entity) {
      return (
        entity.x > canvas.height
        || entity.y > canvas.width
        || entity.x < 0
        || entity.y < 0
      );
    }

    function removeOffScreenBullets(entity) {
      if (
        entity instanceof Bullet
        && isOffTheBoard(entity)
      ) {
        entities.splice(entities.indexOf(entity), 1);
      }
    }

    function tick() {
      drawNewBackground();
      drawInfo();

      if (lives === 0) {
        return;
      }

      handleCollisions();

      const numberOfAsteroids = entities.filter(
        (entity) => entity instanceof Asteroid,
      ).length;
      const numberOfBullets = entities.filter(
        (entity) => entity instanceof Bullet,
      ).length;

      const allEntitiesToAdd = [];
      for (let i = 0; i < entities.length; i += 1) {
        const entity = entities[i];
        removeOffScreenBullets(entity);
        entity.draw(ctx);

        // Currently the ship can send back bullets to add to entities.
        const entitiesToAdd = entity.update({
          canvas,
          numberOfBullets,
          numberOfAsteroids,
        });

        if (entitiesToAdd) {
          allEntitiesToAdd.push(...entitiesToAdd);
        }
      }

      entities.push(...allEntitiesToAdd);

      if (numberOfAsteroids < 1) {
        level += 1;
        for (let i = 0; i < level; i += 1) {
          const p = new Placement();
          const newV = { x: Math.random() * 0.5, y: Math.random() * 0.5 };
          entities.push(new Asteroid(AsteroidSize, newV, p.x, p.y));
        }
      }
      window.requestAnimationFrame(tick);
    }

    entities.push(new Ship(255, canvas, ctx));
    for (let i = 0; i < level; i += 1) {
      const p = new Placement();
      const newV = { x: Math.random() * 0.5, y: Math.random() * 0.5 };
      entities.push(new Asteroid(AsteroidSize, newV, p.x, p.y));
    }

    tick();
  }

  game(ctx);

  window.addEventListener('keypress', (e) => {
    if (e.keyCode === 82) {
      game(ctx);
    }
  });
};

export default renderAsteroidsInElement;
