import { createFixedLengthList } from './utils/fixed-length-list.js';

/**
 * Generate random number in range
 * @param {number} min
 * @param {number} max
 */
const rand = (min, max) => Math.random() * (max - min) + min;

const createSquare = () => {
  const position = { x: rand(0, 630), y: rand(0, 470) };
  const velocity = { x: rand(0, 300), y: rand(0, 300) };

  return {
    position,
    velocity,
    color: `rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, 1)`,
    collider: {
      width: 10,
      height: 10,
      get left() {
        return position.x;
      },
      get right() {
        return position.x + this.width;
      },
      get top() {
        return position.y;
      },
      get bottom() {
        return position.y + this.height;
      },
    },
  };
};

const squares = Array.from({ length: 4000 }, createSquare);

let width = 0;
let height = 0;
/**
 * @type {OffscreenCanvas}
 */
let wbuffer;
/**
 * @type {OffscreenCanvasRenderingContext2D}
 */
let wctx;
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

  wctx.clearRect(0, 0, 640, 480);

  for (const square of squares) {
    wctx.fillStyle = square.color;
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

    wctx.fillRect(
      square.position.x,
      square.position.y,
      square.collider.width,
      square.collider.height,
    );
  }

  wctx.fillStyle = 'black';
  wctx.fillRect(540, 0, 100, 60);
  wctx.fillStyle = 'white';
  wctx.fillText(averageFps.toString(), width - 30, 20);
  wctx.fillText(`squares: ${squares.length}`, width - 80, 40);
  // wctx.fillText(`{ x: ${square.position.x}, y: ${square.position.y} }`, 10, 40);
  // wctx.fillText(`{ hrt: ${hrt} }`, 10, 60);

  last = hrt;
}

/**
 * @param {MessageEvent} event
 */
self.onmessage = (event) => {
  if (event.data.event === 'start') {
    wbuffer = /** @type {OffscreenCanvas} */ event.data.buffer;
    wctx = /** @type {OffscreenCanvasRenderingContext2D} */ (wbuffer.getContext(
      '2d',
    ));

    width = wbuffer.width;
    height = wbuffer.height;

    requestAnimationFrame(frame);
  }
};
