import {
  ParticleOptions,
  Vector,
  forces,
  ParticleForce
} from "react-particle-image";

export const particleOptions: ParticleOptions = {
  filter: ({ x, y, image }) => {
    const pixel = image.get(x, y);
    return pixel.b > 50;
  },
  color: ({ x, y, image }) => "#10b981",
  radius: () => Math.random() * 1.5 + 0.5,
  mass: () => 40,
  friction: () => 0.15,
  initialPosition: ({ canvasDimensions }) => {
    return new Vector(canvasDimensions.width / 2, canvasDimensions.height / 2);
  }
};

export const motionForce = (x: number, y: number): ParticleForce => {
  return forces.disturbance(x, y, 5);
};
