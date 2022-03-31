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

    if (!assignOptionsToSquares(ca, options).length) {
      throw 'error. not enough squares for poll options';
    } else {
      this.options = assignOptionsToSquares(ca, options);
    }
  }

  get id(): string {
    return this._id;
  }

}

/**
 * ServerConversationArea, string[] --> PollOption[]
 * 
 * The ConversationAreaPoll constructor recieves a list of string poll responses and
 * will turn them into a list of PollOptions. 
 * 
 * In order to define each PollOption, it will need to map spots within the conversation
 * to options.
 */
function assignOptionsToSquares(conversation: ServerConversationArea, options: string[]): PollOption[] {
  // 1. get list of the possible GridSquares within conversation
  let squares: GridSquare[] = conversation.getIndividualSquares();
  let pollOptions: PollOption[] = [];
  // 2. check: # options <= # available GridSquares
  if (options.length >= squares.length) {
    // 3. map options to squares: string[] --> PollOption[]
    
    options.forEach(o => {
      pollOptions.push(new PollOption(o));
    });
  }

  return pollOptions
}