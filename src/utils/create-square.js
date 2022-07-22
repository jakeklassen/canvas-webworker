import { rand } from './rand.js';

export const createSquare = () => {
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
