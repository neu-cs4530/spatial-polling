import { Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import useMaybeVideo from "../../hooks/useMaybeVideo";
import { PollViewProps, listOptions, parseTime } from "./ActivePollView";

export default function ActivePollViewVoter(pvProps: PollViewProps) {
    const video = useMaybeVideo()
    const [time, checkTime] = useState(pvProps.poll!.timer.duration);
    // PollTimer tracks time of poll, second timer with shorter cooldown ensures modal timer is up to date
    const timerCheck = setInterval(() => {checkTime(pvProps.poll!.timer.duration)}, 100);
    
    return (
        <Modal isOpen={pvProps.isOpen} onClose={()=>{pvProps.closeModal(); clearInterval(timerCheck); video?.unPauseGame;}}>
        <ModalOverlay/>
        <ModalHeader>
            <text>
                Poll Information
            </text>
        </ModalHeader>
        <ModalBody pb={6}>
            <text>
                <b>Prompt:</b> {pvProps.poll!.prompt}
            </text>
            <text>
                <b>Time Remaining:</b> {parseTime(time)}
            </text>
            <text>
                <b>You are currently voting for: </b>
            </text>
            <text>
                <b>Poll Options:</b>
            </text>
            <ul>
                {listOptions(pvProps)}
            </ul>
        </ModalBody>
        <ModalCloseButton/>
    </Modal>)
}