import { Button, Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";
import useMaybeVideo from "../../hooks/useMaybeVideo";
import { PollViewProps, listOptions, parseTime } from "./ActivePollView";

export default function ActivePollViewCreator(pvProps: PollViewProps) {
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
                <b>Current Prompt:</b> {pvProps.poll!.prompt}
            </text>
            <text>
                <b>Time Remaining:</b> {parseTime(time)}
            </text>
            <text>
                <b>Current Poll Options:</b>
            </text>
            <ul>
                {listOptions(pvProps)}
            </ul>
            <Button colorScheme='blue' ml={3} onClick={() => {pvProps.poll!.timer.pauseTimer()}}>Toggle Timer Pause</Button>
            <Button colorScheme='blue' mr={3} onClick={() => {pvProps.poll!.timer.addTime(10)}}>Add 10 seconds</Button>
        </ModalBody>
        <ModalCloseButton/>
    </Modal>)
}