import { nanoid } from 'nanoid';
// import Player from '../../../../services/townService/src/types/Player';
import PollOption from './PollOption';
import PollTimer from './PollTimer';
import BoundingBox from '../BoundingBox';
import { ServerConversationAreaPoll } from '../../../../services/townService/src/client/TownsServiceClient';
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
  const tiles: BoundingBox[] = boundingBox.getTiles();
  const pollOptions: PollOption[] = [];

  // can't have more options than tiles
  if (options.length <= tiles.length) {
    // assign each option to random tile of conversation
    options.forEach((o) => {
      const randomIndex = Math.floor(Math.random() * tiles.length);
      pollOptions.push(new PollOption(o, tiles[randomIndex]));
      tiles.splice(randomIndex, 1);
    });
  }
  // console.log(pollOptions);
  return pollOptions;
}

/**
 * A spatial poll within a conversation area is represented by a ConversationAreaPoll object
 */
export default class ConversationAreaPoll {
  public prompt: string;

  public creatorID: string;

  public options: PollOption[];

  public timer: PollTimer;

  /** The unique identifier for this poll * */
  private readonly _id: string;

  /**
   * Constructor to instantiate a new poll.
   * @param prompt the poll question
   * @param boundingBox the bounding box of the conversation area in which this poll is
   * @param creatorID the id of the Player who created it
   * @param options the poll response options provided by the creator
   * @param duration the number of seconds this poll will last for
   */
  constructor(prompt: string, boundingBox: BoundingBox, creatorID: string, options: string[], duration: number) {
    this.prompt = prompt;
    this.creatorID = creatorID;
    this.timer = new PollTimer(duration);
    this._id = nanoid();

    if (!assignOptionsToTiles(boundingBox, options).length) {
      throw new Error('error: more poll options than tiles');
    } else {
      this.options = assignOptionsToTiles(boundingBox, options);
    }
  }

  /** To retrieve the unique identifier for this poll * */
  get id(): string {
    return this._id;
  }

  toServerConversationAreaPoll(): ServerConversationAreaPoll {
    return {
      creator: this.creatorID,
      prompt: this.prompt,
      options: this.options,
      timer: this.timer,
    };
  }
}

