import React from 'react';
import {
  Progress,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  } from '@chakra-ui/react';
  import ConversationArea from '../../classes/ConversationArea';
  import Player from '../../classes/Player';
  import ConversationAreaPoll from '../../classes/pollClasses/ConversationAreaPoll';
  import PollOption from '../../classes/pollClasses/PollOption';
  
  
  type ActiveConversationPollModalProps = {
      poll: ConversationAreaPoll;
      conversation: ConversationArea;
      players: Player[];
  }

export default function ActiveConversationPollModal( {poll, conversation, players} : ActiveConversationPollModalProps ) {
     
  
  // get the user names of the voters who voted from this option
  function getVoters(o: PollOption) {
    const voterNames: string[] = [];    
    o.voters.forEach(voterID => {
      const playerName = players.find(p => p.id === voterID)?.userName;
      if (playerName) {
        voterNames.push(playerName);
      }
    });
    return voterNames.join();
  }

  function getPercent(o: PollOption, c: ConversationArea) {
    return (o.voters?.length / c.occupants?.length) * 100;
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
  
  