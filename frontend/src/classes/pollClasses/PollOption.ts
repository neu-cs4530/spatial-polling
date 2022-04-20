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
    public readonly location: BoundingBox;

     /** title of the poll * */
    public readonly text: string;

     /** list of players who voted for this option * */
    public voters: string[];

    constructor(text: string, location: BoundingBox) {
        this.location = location;
        this.text = text;
        this.voters = [];
    }

    /**
     * Add a given voter to the list of voters.
     * @param player 
     */
    addVoter(playerId: string): void {
        this.voters.push(playerId);
    }

    /**
    * Remove a given voter from the list of voters.
    * @param player 
    */
    removeVoter(playerId: string): void {
        this.voters.splice(this.voters.findIndex(p => playerId === p));
    }

    toServerPollOption(): ServerPollOption {
        return {
            location: this.location,
            text: this.text,
            voters: this.voters,
        };
      }
}