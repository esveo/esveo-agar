import { UpdateGameStateEvent, Vector } from "@esveo-agar/shared";

export type WorldState = {
  camera: {
    position: Vector;
    size: number;
  };
  gameState: UpdateGameStateEvent;
};
