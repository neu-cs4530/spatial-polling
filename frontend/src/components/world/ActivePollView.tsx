import Player from "../../classes/Player";
import ConversationAreaPoll from "../../classes/pollClasses/ConversationAreaPoll";
import ActivePollViewCreator from "./ActivePollViewCreator";
import ActivePollViewVoter from "./ActivePollViewVoter";

export type ActivePollViewProps = {
    isOpen: boolean;
    closeModal: ()=>void;
    player: Player;
    poll: ConversationAreaPoll;
}

const colorsArray: string[] = ['red', 'blue', 'green', 'yellow']

export function listOptions(apvProps: ActivePollViewProps): JSX.Element[] {
    
    var optionsList: JSX.Element[] = [];
    apvProps.poll.options.forEach((option, index) => {
        optionsList.push(<li id={index.toString()}><span style={{color: colorsArray[index]}}>■</span> {option}</li>)
    })
    return optionsList;
}

export default function ActivePollView(apvProps: ActivePollViewProps): JSX.Element {
    if (apvProps.player.id === apvProps.poll.creatorID) {
        return ActivePollViewCreator(apvProps);
    } else {
        return ActivePollViewVoter(apvProps);
    }
}