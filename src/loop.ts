import { createFixedLengthList } from './utils/fixed-length-list';

const square = { position: { x: 0, y: 100 }, velocity: { x: 100 } };

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
  let dt = (hrt - last) / 1000;
  dts.add(dt);
  const averageFps = Math.round(
    1 / (dts.list.reduce((a, b) => a + b, 0) / dts.list.length),
  );

  wctx.clearRect(0, 0, 640, 480);
  wctx.fillStyle = 'red';
  square.position.x += square.velocity.x * dt;
  wctx.fillRect(square.position.x, square.position.y, 10, 10);

  wctx.fillStyle = 'white';
  wctx.fillText(averageFps.toString(), 10, 20);
  wctx.fillText(`{ x: ${square.position.x}, y: ${square.position.y} }`, 10, 40);
  wctx.fillText(`{ hrt: ${hrt} }`, 10, 60);

  last = hrt;
}

self.onmessage = event => {
  if (event.data.event === 'start') {
    wbuffer = event.data.buffer as OffscreenCanvas;
    wctx = wbuffer.getContext('2d');

    requestAnimationFrame(frame);
  }
};
