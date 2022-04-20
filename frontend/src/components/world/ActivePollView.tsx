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

export function listOptions(pvProps: PollViewProps): JSX.Element[] {
    var optionsList: JSX.Element[] = [];
    pvProps.poll!.options.forEach((option, index) => {
        optionsList.push(<li id={index.toString()}><span style={{color: colorsArray[index]}}>■</span> {option}</li>)
    })
    return optionsList;
}

export function parseTime(time: number): string {
    let minute = Math.trunc(time / 60).toString();
    let second = time % 60;
    if (second > 9) {
        return minute + ":" + second.toString();
    } else {
        return minute + ":0" + second.toString();
    }
}

export default function ActivePollView(pvProps: PollViewProps): JSX.Element {
    const video = useMaybeVideo();
    if (!pvProps.poll) {
        return (
        <Modal isOpen={pvProps.isOpen} onClose={()=>{pvProps.closeModal(); video?.unPauseGame;}}>
            <ModalCloseButton/>
            <ModalBody>
                <text>There is no active poll at this time. Press 'Shift' to start one!</text>
            </ModalBody>
        </Modal>
        )
    }
    else if (pvProps.poll.timer.duration === 0) {
        return ExpiredPollView(pvProps);
    }
    else if (pvProps.player.id === pvProps.poll.creatorID) {
        return ActivePollViewCreator(pvProps);
    } else {
        return ActivePollViewVoter(pvProps);
    }
}