import { GameState } from "@esveo-agar/shared";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    private playerId: number,
  ) {
    this.ctx = canvas.getContext("2d")!;
  }

  public render(state: GameState) {
    requestAnimationFrame(() => {
      const player = state.players[this.playerId];
      if (!player) throw Error("noooo");
      this.clear();
      this.ctx.translate(
        this.ctx.canvas.width / 2 - player.position.x,
        this.ctx.canvas.height / 2 - player.position.y,
      );
      this.drawPlayers(state);
      this.drawParticles(state);
      this.ctx.resetTransform();
    });
  }

  private clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  private drawPlayers(state: GameState) {
    for (const player of Object.values(state.players)) {
      this.drawCircle(
        player.position.x,
        player.position.y,
        player.radius,
        "red",
      );
    }
  }

  private drawParticles(state: GameState) {
    for (const particle of state.particles) {
      this.drawCircle(particle.x, particle.y, 2, "blue");
    }
  }

  private drawCircle(x: number, y: number, radius: number, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
