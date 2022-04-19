import { Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import useMaybeVideo from "../../hooks/useMaybeVideo";
import { ActivePollViewProps, listOptions } from "./ActivePollView";

export default function ActivePollViewCreator(apvProps: ActivePollViewProps) {
    const video = useMaybeVideo()
    return (
    <Modal isOpen={apvProps.isOpen} onClose={()=>{apvProps.closeModal(); video?.unPauseGame;}}>
        <ModalOverlay/>
        <ModalHeader>
            <text>
                Poll Information
            </text>
        </ModalHeader>
        <ModalBody pb={6}>
            <text>
                <b>Current Prompt:</b> {apvProps.poll.prompt}
            </text>
            <text>
                <b>Current Poll Options:</b>
            </text>
            <ul>
                {listOptions(apvProps)}
            </ul>
        </ModalBody>
        <ModalCloseButton/>
    </Modal>)
}