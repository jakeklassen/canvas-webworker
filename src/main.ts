import squareUri from '../assets/square.png';

const canvas = document.querySelector('#game') as HTMLCanvasElement;
const buffer = canvas.transferControlToOffscreen();

const worker = new Worker('loop.ts');

const urlParts = location.href.split('/');
if (urlParts[urlParts.length - 1].indexOf('.') !== -1) {
  urlParts.pop();
}

const renderer = document.createElement('canvas');
renderer.width = 10;
renderer.height = 10;
const rendererctx = renderer.getContext('2d');
rendererctx.fillStyle = 'red';
rendererctx.fillRect(0, 0, 10, 10);

const square = new Image();
square.onload = () => {
  createImageBitmap(square, 0, 0, 10, 10).then(bitmap => {
    worker.postMessage({ event: 'start', buffer, assets: { square: bitmap } }, [
      buffer,
      bitmap,
    ]);
  });
};
square.src = squareUri;
