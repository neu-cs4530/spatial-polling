import Player from '../../../../services/townService/src/types/Player';
import BoundingBox from '../BoundingBox';

// TODO: implement the rest of the PollOption class
/**
   * every PollOption has
   * @param text the description of this option
   * @param location 
   * @param voters the players who have voted for this option
   */
export default class PollOption {
  public text: string;

  public location: BoundingBox;

  public voters: Player[];

  constructor(text: string, location: BoundingBox) {
    this.text = text;
    this.location = location;
    this.voters = [];
  }
}