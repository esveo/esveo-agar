import type { Vector } from "./vector.ts";

export type UpdatePlayerInputEvent = {
  input: Vector;
};

export type UpdateGameStateEvent = {
  you: number;
  players: {
    [id: number]: {
      position: Vector;
      color: string;
      radius: number;
    };
  };
  food: Vector[];
};
