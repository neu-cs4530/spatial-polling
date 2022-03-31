import { GridSquare } from "../client/TownsServiceClient";
import Player from "./Player";

/**
 * A PollOption class which defines the state of one poll choice and manages changes
 * to the state as users move in and out of this poll option's location.
 */

 export default class PollOption {
     
     /** location of the poll * */ 
    public location: GridSquare;

     /** title of the poll * */
    private readonly _text: string;

     /** list of players who voted for this option * */
    private _voters: Player[];

    constructor(text: string, location: GridSquare) {
        this.location = location;
        this._text = text;
        this._voters = [];
    }
     
    get voters(): Player[] {
        return this._voters ;
    }

    get text(): string {
        return this._text;
    }

        /**
         * Add a given voter to the list of voters.
         * @param player 
         */
        addVoter(player: Player): void {
            this._voters.push(player);
        }
        /**
        * Remove a given voter from the list of voters.
        * @param player 
        */

        removeVoter(player: Player): void {
            this._voters.splice(this._voters.findIndex(p => player === p), 1);
        }

}





