export const GAME_WOLRD_WIDTH = 1000;
export const GAME_WOLRD_HEIGHT = 1000;

export type Vector = {
  x: number;
  y: number;
};

export type PlayerId = number;

export type Player = {
  id: PlayerId;
  position: Vector;
  /**
   * Radius of zero means dead
   */
  radius: number;
};

export type Particle = Vector;

export type GameState = {
  players: Record<PlayerId, Player>;
  particles: Particle[];
};

// TODO: move to server
export type ClientInputState = {
  /**
   * The normalized direction the player is moving in
   */
  direction: Vector;
};

export type ClientInputEvent = {
  playerId: PlayerId;
  type: "input";
  /**
   * Normalized
   */
  direction: Vector;
};

export type ClientRespawnEvent = {
  playerId: PlayerId;
  type: "respawn";
};

export type ClientEvent = ClientInputEvent | ClientRespawnEvent;

export type ServerGameStateUpdateEvent = {
  type: "gamestateupdate";
  gameState: GameState;
};

export type ServerWelcomeEvent = {
  type: "serverwelcome";
  playerId: PlayerId;
  mapSize: Vector;
};

export type ServerEvent = ServerGameStateUpdateEvent | ServerWelcomeEvent;

export * as vector from "./vector.ts";
