/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  useDisclosure,
  } from '@chakra-ui/react';
  import React,{ useCallback,useState } from 'react';
  import ConversationArea from '../../classes/ConversationArea';
  import ConversationAreaPoll from '../../classes/pollClasses/ConversationAreaPoll';
  import useCoveyAppState from '../../hooks/useCoveyAppState';
  import useMaybeVideo from '../../hooks/useMaybeVideo';
  
  
  type NewConversationPollModalProps = {
      isOpen: boolean;
      closeModal: ()=>void;
      conversation: ConversationArea;
      creator: string;
  }

  // export default function NewConversationPollModal( {isOpen, closeModal, conversation, creator} : NewConversationPollModalProps): JSX.Element {
  //     // const {apiClient, sessionToken, currentTownID} = useCoveyAppState();
  
  //     const video = useMaybeVideo()
  
  //     return (
  //       <Modal isOpen={isOpen} onClose={()=>{closeModal(); video?.unPauseGame()}}>
  //         <ModalOverlay />
  //         <ModalContent>
  //           <ModalHeader>Active Poll: {conversation.activePoll?.prompt} </ModalHeader>
  //           <ModalHeader>Time left to vote: {conversation.activePoll?.timer.timer} </ModalHeader>
  //           <ModalCloseButton />
  //             <ModalBody pb={6}>

                
  //             </ModalBody>
  //             <ModalFooter>
  //               <Button onClick={closeModal}>Cancel</Button>
  //             </ModalFooter>
  //         </ModalContent>
  //       </Modal>
  //     );
  // }

  export default function ActiveConversationPollModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
        <Modal
          isCentered
          onClose={onClose}
          isOpen
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque laborum distinctio, consequuntur tempore qui atque, itaque provident culpa necessitatibus quis voluptatum! Laudantium aspernatur, nemo nulla sint perspiciatis ad mollitia. Minus.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }
  
  