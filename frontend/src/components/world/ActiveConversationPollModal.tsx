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
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  } from '@chakra-ui/react';
  import React,{ useCallback,useState } from 'react';
  import ConversationArea from '../../classes/ConversationArea';
  import ConversationAreaPoll from '../../classes/pollClasses/ConversationAreaPoll';
import PollOption from '../../classes/pollClasses/PollOption';
  import useCoveyAppState from '../../hooks/useCoveyAppState';
  import useMaybeVideo from '../../hooks/useMaybeVideo';
  
  
  type ActiveConversationPollModalProps = {
      poll: ConversationAreaPoll;
      conversation: ConversationArea;
  }

export default function ActiveConversationPollModal( {poll, conversation} : ActiveConversationPollModalProps ) {
     
  
  // get the user names of the voters who voted from this option
  function getVoters(o: PollOption) {
    // const userNamesOfVoters = [];
    // const localPlayers = [];
    // conversation.occupants.forEach(element => {
    //   localPlayers.push(p => p)
    // });
    
    // o.voters.forEach(voterID => {
      
    // });
    return o.voters.toString();
  }

  function getPercent(o: PollOption, c: ConversationArea) {
    console.log(`o.voters?.length=${  o.voters?.length}`);
    console.log(`conversation.occupants?.length=${  conversation.occupants?.length}`);
    return (o.voters?.length / conversation.occupants?.length) * 100;
  }

  return (
      <>
        <TableContainer>
          <Table size='sm'>
          <Thead>
              <Tr>
                <Th>Active Poll:</Th>
                <Th>{poll.prompt}</Th>
                <Th />
              </Tr>
            </Thead>
            <Thead>
              <Tr>
                <Th />
                <Th>Votes</Th>
                <Th>Voters</Th>
              </Tr>
            </Thead>
            <Tbody>
              {poll.options.map(o => 
                <Tr key={o.text}>
                <Td>{o.text}</Td>
                <Td>{o.voters?.length}<Progress value={getPercent(o, conversation)} /></Td>
                <Td>{getVoters(o)}</Td>
              </Tr>
              )
              }
            </Tbody>
          </Table>
        </TableContainer>
      </>
    )
  }
  
  