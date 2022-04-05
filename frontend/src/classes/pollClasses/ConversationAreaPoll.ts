import { nanoid } from 'nanoid';
import Player from '../../../../services/townService/src/types/Player';
import PollOption from './PollOption';
import PollTimer from './PollTimer';
import BoundingBox from '../BoundingBox';

/** 
 * ConversationAreaPoll constructor must turn a list of string poll options to a list of PollOptions. 
 * 
 * In order to do this, it must figure out the available tiles within this conversation area, and map 
 * each option to some tile, without overlaps.
 * @param conversation the conversation area this poll is in
 * @param options the list of string options players can vote for. length >= 1.
 * 
 * @returns a list of PollOption objects
 */
 function assignOptionsToTiles(boundingBox: BoundingBox, options: string[]): PollOption[] {
  // const {tiles} = conversation.boundingBox;
  const pollOptions: PollOption[] = [];
  // if (options.length >= tiles.length) {
  //   // TODO later: choose a random tile from tiles array instead of the ith
  //   options.forEach((o, i) => {  
  //     pollOptions.push(new PollOption(o, tiles[i])); // map options to tiles: string[] --> PollOption[]
  //   });
  // }

  return pollOptions;
}

/**
 * A spatial poll within a conversation area is represented by a ConversationAreaPoll object
 */
export default class ConversationAreaPoll {
  public prompt: string;

  public creator: Player;

  public options: PollOption[];

  public timer: PollTimer;

  /** The unique identifier for this poll * */
  private readonly _id: string;

  constructor(prompt: string, boundingBox: BoundingBox, creator: Player, options: string[], duration: number) {
    this.prompt = prompt;
    this.creator = creator;
    this.timer = new PollTimer(duration);
    this._id = nanoid();

    // there cannot be more than 4 poll options
    if (!assignOptionsToTiles(boundingBox, options).length) {
      throw new Error('error: more than 4 poll options provided');
    } else {
      this.options = assignOptionsToTiles(boundingBox, options);
    }
  }

  get id(): string {
    return this._id;
  }
}

