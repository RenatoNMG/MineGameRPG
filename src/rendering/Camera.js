export class Camera {
  constructor(viewportWidth, viewportHeight, worldWidth, worldHeight) {
    this.x = 0;
    this.y = 0;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  follow(target) {
    const maxX = Math.max(0, this.worldWidth - this.viewportWidth);
    const maxY = Math.max(0, this.worldHeight - this.viewportHeight);
    this.x = Math.max(0, Math.min(maxX, target.x - this.viewportWidth / 2));
    this.y = Math.max(0, Math.min(maxY, target.y - this.viewportHeight / 2));
  }
}