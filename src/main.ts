const canvas = document.querySelector('#game') as HTMLCanvasElement;
const buffer = canvas.transferControlToOffscreen();

const worker = new Worker('loop.ts');

const urlParts = location.href.split('/');
if (urlParts[urlParts.length - 1].indexOf('.') !== -1) {
  urlParts.pop();
}

worker.postMessage({ event: 'start', buffer }, [buffer]);
