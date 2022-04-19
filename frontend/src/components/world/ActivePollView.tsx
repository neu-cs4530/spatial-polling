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

export default function ActivePollView(apvProps: ActivePollViewProps): JSX.Element {
    if (apvProps.player.id === apvProps.poll.creatorID) {
        return ActivePollViewCreator(apvProps);
    } else {
        return ActivePollViewVoter(apvProps);
    }
}