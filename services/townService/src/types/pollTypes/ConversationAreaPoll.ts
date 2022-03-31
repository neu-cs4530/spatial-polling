import { nanoid } from 'nanoid';
import { GridSquare, ServerConversationArea } from '../../client/TownsServiceClient';
import Player from '../Player';
import PollOption from './PollOption';
import PollTimer from './PollTimer';

/**
 * A spatial poll within a conversation area is represented by a ConversationAreaPoll object
 */
export default class ConversationAreaPoll {
  public prompt: String;
  public creator: Player;
  public options: PollOption[];
  public timer: PollTimer;

  /** The unique identifier for this poll * */
  private readonly _id: string;

  /** The ConversationArea that this poll belongs to */
  private _conversationArea: ServerConversationArea;

  constructor(ca: ServerConversationArea, prompt: string, creator: Player, options: string[], duration: number) {
    this._conversationArea = ca;
    this.prompt = prompt;
    this.creator = creator;
    this.timer = new PollTimer(duration);
    this._id = nanoid();

    // there cannot be more poll options than available tiles
    if (!assignOptionsToTiles(ca, options).length) {
      throw 'error: not enough squares for the given number of poll options';
    } else {
      this.options = assignOptionsToTiles(ca, options);
    }
  }

  get id(): string {
    return this._id;
  }
}

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
function assignOptionsToTiles(conversation: ServerConversationArea, options: string[]): PollOption[] {
  let tiles: GridSquare[] = conversation.boundingBox.tiles;
  let pollOptions: PollOption[] = [];
  if (options.length >= tiles.length) {
    // TODO later: choose a random tile from tiles array instead of the ith
    options.forEach((o, i) => {  
      pollOptions.push(new PollOption(o, tiles[i])); // map options to tiles: string[] --> PollOption[]
    });
  }

  return pollOptions
}