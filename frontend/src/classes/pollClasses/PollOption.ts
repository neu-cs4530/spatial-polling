import BoundingBox from "../BoundingBox";

export type ServerPollOption = {
    location: BoundingBox;
    text: string;
    voters: string[];
  };


/** 
 * A ConversationAreaPoll has a list of PollOption, each representing an option to be voted for on a poll.
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

    /** Manages changes to the state as users move in and out of this poll option's location. * */
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