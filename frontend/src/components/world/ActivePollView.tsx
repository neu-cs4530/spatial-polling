import { Modal, ModalBody, ModalCloseButton, useModal } from "@chakra-ui/react";
import Player from "../../classes/Player";
import ConversationAreaPoll from "../../classes/pollClasses/ConversationAreaPoll";
import useMaybeVideo from "../../hooks/useMaybeVideo";
import ActivePollViewCreator from "./ActivePollViewCreator";
import ActivePollViewVoter from "./ActivePollViewVoter";
import ExpiredPollView from "./ExpiredPollView";

export type PollViewProps = {
    isOpen: boolean;
    closeModal: ()=>void;
    player: Player;
    poll: ConversationAreaPoll | undefined;
}

const colorsArray: string[] = ['red', 'blue', 'green', 'yellow']

export function listOptions(apvProps: PollViewProps): JSX.Element[] {
    var optionsList: JSX.Element[] = [];
    apvProps.poll!.options.forEach((option, index) => {
        optionsList.push(<li id={index.toString()}><span style={{color: colorsArray[index]}}>■</span> {option}</li>)
    })
    return optionsList;
}

export default function ActivePollView(apvProps: PollViewProps): JSX.Element {
    const video = useMaybeVideo();
    if (!apvProps.poll) {
        return (
        <Modal isOpen={apvProps.isOpen} onClose={()=>{apvProps.closeModal(); video?.unPauseGame;}}>
            <ModalCloseButton/>
            <ModalBody>
                <text>There is no active poll at this time. Press 'Shift' to start one!</text>
            </ModalBody>
        </Modal>
        )
    }
    else if (apvProps.poll.timer.duration === 0) {
        return ExpiredPollView(apvProps);
    }
    else if (apvProps.player.id === apvProps.poll.creatorID) {
        return ActivePollViewCreator(apvProps);
    } else {
        return ActivePollViewVoter(apvProps);
    }
}