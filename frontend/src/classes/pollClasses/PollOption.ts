import BoundingBox from "../BoundingBox";

// TODO
export type ServerPollOption = {
    location: BoundingBox;
    text: string;
    voters: string[];
  };

/** A PollOption class which defines the state of one poll choice and manages changes
 * to the state as users move in and out of this poll option's location.
 */

 export default class PollOption {

     /** location of the poll * */ 
    public location: BoundingBox;

     /** title of the poll * */
    private readonly _text: string;

     /** list of players who voted for this option * */
    private _voters: string[];

    constructor(text: string, location: BoundingBox) {
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
    set addVoter(playerId: string){
        if (!this._voters.includes(playerId)){
            this._voters.push(playerId);
        }
    }

    /**
    * Remove a given voter from the list of voters.
    * @param player 
    */
    set removeVoter(playerId: string) {
        this._voters.splice(this._voters.findIndex(p => playerId === p), 1);
    }
 
    toServerPollOption(): ServerPollOption {
        return {
            location: this.location,
            text: this._text,
            voters: this._voters,
        };
      }
}