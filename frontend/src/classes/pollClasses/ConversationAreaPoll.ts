import { nanoid } from 'nanoid';
import PollOption, { ServerPollOption } from './PollOption';
import PollTimer, { ServerPollTimer } from './PollTimer';
import BoundingBox from '../BoundingBox';

export type ServerConversationAreaPoll = {
  creator: string;
  prompt: string;
  options: ServerPollOption[];
  timer: ServerPollTimer;
  expired: boolean;
};

/** 
 * Helper for ConversationAreaPoll constructor which turns a list of string poll options to a list of PollOptions.
 * 
 * @param boundingBox the bounding box of the conversation area this poll is in
 * @param options the list of string options players can vote for, with 2 <= len(options) <= 4
 * 
 * @returns a list of PollOption objects
 */
 function assignOptionsToTiles(boundingBox: BoundingBox, options: string[]): PollOption[] {
  const tiles: BoundingBox[] = boundingBox.getQuadrants();
  const pollOptions: PollOption[] = [];

  if (options.length <= tiles.length) {
    options.forEach((o, i) => {
      pollOptions.push(new PollOption(o, tiles[i]));
    });
  }
  return pollOptions;
}

/**
 * A spatial poll within a conversation area is represented by a ConversationAreaPoll object
 */
export default class ConversationAreaPoll {
  /** The polling question asked * */ 
  public prompt: string;
  
  /** The id of the player who created the poll * */ 
  public creatorID: string;

  /** The list of options which may be voted for * */ 
  public options: PollOption[];

  /** The timer object which maintains the state of time left in the poll * */ 
  public timer: PollTimer;

  /** Flag indicating whether or not this poll is still active (accepting votes) * */ 
  public expired: boolean;

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
    this.expired = false;

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
    const serverPollOps = this.options.map(o => o.toServerPollOption());
    return {
      creator: this.creatorID,
      prompt: this.prompt,
      options: serverPollOps,
      timer: this.timer.toServerPollTimer(),
      expired: this.expired,
    };
  }
}

