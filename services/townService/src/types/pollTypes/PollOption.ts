import Player from '../Player';
import { GridSquare } from '../../client/TownsServiceClient';

// TODO: implement the rest of the PollOption class
/**
   * every PollOption has
   * @param text the description of this option
   * @param location 
   * @param voters the players who have voted for this option
   */
export default class PollOption {
  public text: String;
  public location: GridSquare;
  public voters: Player[];

  constructor(text: string, location: GridSquare) {
    this.text = text;
    this.location = location;
    this.voters = [];
  }
}