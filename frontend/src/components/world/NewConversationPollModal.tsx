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
  
  useToast
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
  export default function NewConversationPollModal( {isOpen, closeModal, conversation, creator} : NewConversationPollModalProps): JSX.Element {
      const [prompt, setPrompt] = useState<string>('');
      const [options, setOptions] = useState<string[]>(['mockOption']);
      const [duration, setDuration] = useState<number>(60); // default 1 min
      // const {apiClient, sessionToken, currentTownID} = useCoveyAppState();
  
      const toast = useToast()
      const video = useMaybeVideo()
  
      const createConversationPoll = useCallback(async () => {
        if (prompt && options.length && duration) {
            const newPoll = new ConversationAreaPoll(prompt, conversation.getBoundingBox(), creator, options, duration);
            conversation.activePoll = newPoll; // theres no way this is all i have to do, right?!
            console.log(`success! conversation ${conversation.label} now has active poll: ${conversation.activePoll}`);
            toast({
              title: 'Poll Created!',
              status: 'success',
            });
            video?.unPauseGame();
            closeModal();
          // try {
          //   await apiClient.createConversation({
          //     sessionToken,
          //     coveyTownID: currentTownID,
          //     conversationArea: conversationToCreate.toServerConversationArea(),
          //   });
          //   toast({
          //     title: 'Conversation Created!',
          //     status: 'success',
          //   });
          //   video?.unPauseGame();
          //   closeModal();
          // } catch (err) {
          //   toast({
          //     title: 'Unable to create conversation',
          //     description: err.toString(),
          //     status: 'error',
          //   });
          // }
        }
      }, [prompt, options, duration, conversation, creator]);
      return (
        <Modal isOpen={isOpen} onClose={()=>{closeModal(); video?.unPauseGame()}}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a Poll for the occupants of {conversation.label} </ModalHeader>
            <ModalCloseButton />
            <form
              onSubmit={ev => {
                ev.preventDefault();
                createConversationPoll();
              }}>
              <ModalBody pb={6}>
                <FormControl isRequired>
                  <FormLabel htmlFor='prompt'>What question do you want to ask?</FormLabel>
                  <Input
                    id='prompt'
                    placeholder='Share the topic of your conversation'
                    name='prompt'
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={createConversationPoll} disabled={!prompt || !options.length || !duration}>
                  Create
                </Button>
                <Button onClick={closeModal}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      );
  }
  
  