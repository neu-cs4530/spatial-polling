import { Modal, ModalBody, ModalCloseButton, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import useMaybeVideo from "../../hooks/useMaybeVideo";
import { PollViewProps, listOptions } from "./ActivePollView";

export default function ActivePollViewVoter(pvProps: PollViewProps) {
    const video = useMaybeVideo()
    return (
        <Modal isOpen={pvProps.isOpen} onClose={()=>{pvProps.closeModal(); video?.unPauseGame;}}>
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
                    <b>Poll Options:</b>
                </text>
                <ul>
                    {listOptions(pvProps)}
                </ul>
            </ModalBody>
            <ModalCloseButton/>
        </Modal>)
}