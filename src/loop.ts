import { createFixedLengthList } from './utils/fixed-length-list';

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const createSquare = (image: ImageBitmapSource) => {
  const position = { x: rand(0, 630), y: rand(0, 470) };
  const velocity = { x: rand(0, 300), y: rand(0, 300) };

  return {
    position,
    velocity,
    color: `rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, 1)`,
    image,
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

let squares = [];

let width;
let height;
let wbuffer: OffscreenCanvas;
let wctx: OffscreenCanvasRenderingContext2D;
let last = performance.now();
let dt = 0;
const dts = createFixedLengthList<number>(10);

function frame(hrt: DOMHighResTimeStamp) {
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

    wctx.drawImage(square.image, square.position.x, square.position.y);
  }

  wctx.fillStyle = 'black';
  wctx.fillRect(540, 0, 100, 60);
  wctx.fillStyle = 'white';
  wctx.fillText(averageFps.toString(), width - 30, 20);
  wctx.fillText(`squares: ${squares.length}`, width - 80, 40);

  last = hrt;
}

self.onmessage = event => {
  if (event.data.event === 'start') {
    const assets = event.data.assets;
    wbuffer = event.data.buffer as OffscreenCanvas;
    wctx = wbuffer.getContext('2d');

    width = wbuffer.width;
    height = wbuffer.height;

    squares = Array.from({ length: 100 }, () => createSquare(assets.square));

    requestAnimationFrame(frame);
  }
};
