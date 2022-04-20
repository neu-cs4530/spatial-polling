
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
   * A helper function used to determine the quadrants which make up this bounding box.
   * @returns the list of 4 bounding boxes which make up this bounding box.
   */
   getQuadrants(): BoundingBox[] {

    // the width of each quadrant is width / 2
    const w = this.width / 2;

    // the height of each quadrant is height / 2
    const h = this.height / 2;


    // For now I will work with 4 quadrants
    const q1 = new BoundingBox(
      this.x - w / 2, 
      this.y - h / 2, 
      w,
      h,
    );

    const q2 = new BoundingBox(
      this.x + w / 2, 
      this.y - h / 2, 
      w,
      h,
    );

    const q3 = new BoundingBox(
      this.x - w / 2, 
      this.y + h / 2, 
      w,
      h,
    );

    const q4 = new BoundingBox(
      this.x + w / 2, 
      this.y + h / 2, 
      w,
      h,
    );

    return [q1,q2,q3,q4];
  }
}
