<<<<<<< HEAD:services/townService/src/types/pollTypes/PollOption.ts
import { GridSquare } from "../../client/TownsServiceClient";

=======
import Player from '../../../../services/townService/src/types/Player';
import BoundingBox from '../BoundingBox';
>>>>>>> 33ceb92a8eb1bfaa82a9c550b91311a7fc3d20aa:frontend/src/classes/pollClasses/PollOption.ts

/**
<<<<<<< HEAD:services/townService/src/types/pollTypes/PollOption.ts
 * A PollOption class which defines the state of one poll choice and manages changes
 * to the state as users move in and out of this poll option's location.
 */

 export default class PollOption {
     
     /** location of the poll * */ 
    public location: GridSquare;

     /** title of the poll * */
    private readonly _text: string;

     /** list of players who voted for this option * */
    private _voters: string[];

    constructor(text: string, location: GridSquare) {
        this.location = location;
        this._text = text;
        this._voters = [];
    }
     
    get voters(): string[] {
        return this._voters ;
    }

    get text(): string {
        return this._text;
    }

        /**
         * Add a given voter to the list of voters.
         * @param player 
         */
        addVoter(playerId: string): void {
            this._voters.push(playerId);
        }
        /**
        * Remove a given voter from the list of voters.
        * @param player 
        */

        removeVoter(playerId: string): void {
            this._voters.splice(this._voters.findIndex(p => playerId === p), 1);
        }

=======
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
>>>>>>> 33ceb92a8eb1bfaa82a9c550b91311a7fc3d20aa:frontend/src/classes/pollClasses/PollOption.ts
}