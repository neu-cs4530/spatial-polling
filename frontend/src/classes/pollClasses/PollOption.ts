import BoundingBox from "../BoundingBox";

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
    public readonly location: BoundingBox;

     /** title of the poll * */
    public readonly text: string;

     /** list of players who voted for this option * */
    private _voters: string[] = [];

    constructor(text: string, location: BoundingBox) {
        this.location = location;
        this.text = text;
    }

    get voters() {
        return this._voters;
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

    set voters(newVoters: string[]) {
      if (newVoters.length !== this._voters.length || !newVoters.every((val, index) => val === this._voters[index])){
        this._voters = newVoters;
      }

    }
 
    toServerPollOption(): ServerPollOption {
        return {
            location: this.location,
            text: this.text,
            voters: this.voters,
        };
      }
}