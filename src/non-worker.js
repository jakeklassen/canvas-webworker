import { createSquare } from './utils/create-square.js';
import { createFixedLengthList } from './utils/fixed-length-list.js';

const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector('#game')
);

const ctx = /** @type {CanvasRenderingContext2D } */ (canvas.getContext('2d'));

const squares = Array.from({ length: 8_000 }, createSquare);

let width = canvas.width;
let height = canvas.height;
let last = performance.now();
let dt = 0;

/**
 * @type {import('./utils/fixed-length-list-type').FixedLengthList<number>}
 */
const dts = createFixedLengthList(10);

/**
 * Frame function
 * @param {DOMHighResTimeStamp} hrt
 */
function frame(hrt) {
  requestAnimationFrame(frame);

  // Seems like the worker `hrt` is not reset on reload so
  // override for now.
  hrt = performance.now();
  dt = (hrt - last) / 1000;
  dts.add(dt);
  const averageFps = Math.round(
    1 / (dts.list.reduce((a, b) => a + b, 0) / dts.list.length),
  );

  ctx.clearRect(0, 0, 640, 480);

  for (const square of squares) {
    ctx.fillStyle = square.color;
    square.position.x += square.velocity.x * dt;
    square.position.y += square.velocity.y * dt;

    if (square.collider.right > width) {
      square.position.x = width - square.collider.width;
      square.velocity.x *= -1;
    } else if (square.collider.left < 0) {
      square.position.x = 0;
      square.velocity.x *= -1;
    }

    if (square.collider.bottom > height) {
      square.position.y = height - square.collider.height;
      square.velocity.y *= -1;
    } else if (square.collider.top < 0) {
      square.position.y = 0;
      square.velocity.y *= -1;
    }

    ctx.fillRect(
      square.position.x,
      square.position.y,
      square.collider.width,
      square.collider.height,
    );
  }

  ctx.fillStyle = 'black';
  ctx.fillRect(540, 0, 100, 60);
  ctx.fillStyle = 'white';
  ctx.fillText(averageFps.toString(), width - 30, 20);
  ctx.fillText(`squares: ${squares.length}`, width - 80, 40);

  last = hrt;
}

requestAnimationFrame(frame);
