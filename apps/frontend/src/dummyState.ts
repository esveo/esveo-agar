import { GameState } from "@esveo-agar/shared";

export const dummyState: GameState = {
  players: {
    1: {
      id: 1,
      position: { x: 300, y: 300 },
      radius: 10,
    },
    2: {
      id: 2,
      position: { x: 200, y: 200 },
      radius: 20,
    },
  },
  particles: new Array(100).fill(0).map((_, i) => ({
    x: Math.random() * 800,
    y: Math.random() * 800,
  })),
};
