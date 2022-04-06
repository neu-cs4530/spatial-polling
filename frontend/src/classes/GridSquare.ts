import BoundingBox from './BoundingBox';

/**
 * This extends the BoundingBox class. It stores the result of toRectPoints() for convenience.
 * @param box a dictionary with the coordinates of the top left and bottom right corners of the BoundingBox
 */
 export default class GridSquare extends BoundingBox {
    public box;
  
    constructor(x: number, y: number, width: number, height: number) {
      super(x, y, width, height);
      this.box = this.toRectPoints;
    }
    
  }