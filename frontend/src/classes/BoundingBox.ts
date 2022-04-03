
export default class BoundingBox {
  public x: number;

  public y: number;

  public width: number;

  public height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public static fromSprite(sprite: Phaser.GameObjects.Sprite): BoundingBox {
    return new BoundingBox(sprite.x, sprite.y, sprite.displayWidth, sprite.displayHeight);
  }

  public static fromStruct(boxThatMightNotBeAClass: BoundingBox): BoundingBox {
    return new BoundingBox(
      boxThatMightNotBeAClass.x,
      boxThatMightNotBeAClass.y,
      boxThatMightNotBeAClass.width,
      boxThatMightNotBeAClass.height,
    );
  }

  /**
   * A helper function used to determine the edges of a BoundingBox.
   * @returns a dictionary with the coordinates of the top left and bottom right corners of the BoundingBox
   */
  toRectPoints() {
    return { 
      x1: this.x - this.width / 2, 
      y1: this.y - this.height / 2, 
      x2: this.x + this.width / 2, 
      y2: this.y + this.height / 2 
    }
  }

  /**
   * A helper function used to determine the smaller bounding boxes which make up this bounding box.
   * @returns the list of tiles which make up this bounding box.
   */
   // this eslint-disable line is only here as this is a stub method to be filled out in my next PR
   // eslint-disable-next-line class-methods-use-this
   getTiles(): BoundingBox[] {
    return [];
  }
}
