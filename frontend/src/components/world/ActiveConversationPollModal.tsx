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
  import './styles.scss'

  type ActiveConversationPollModalProps = {
      poll: ConversationAreaPoll;
      conversation: ConversationArea;
      players: Player[];
  }

function parseTime(time: number | undefined): string {
  if (time) {
    const minute = Math.trunc(time / 60).toString();
    const second = time % 60;
    if (second > 9) {
        return `${minute}:${second.toString()}`;
    }
    return `${minute}:0${second.toString()}`;
  }
  return '';
}

export default function ActiveConversationPollModal( {poll, conversation, players} : ActiveConversationPollModalProps ) {
     
  const colors = ['#C88A88', '#AACDE9','#A89BCA','#81B7BA'];

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
    return (o.voters.length / c.occupants?.length) * 100;
  }

  return (
      <>
        <TableContainer>
          <Table size='sm'>
          <Thead>
              <Tr>
                <Th>{!poll.expired ? 'Move to vote for poll:' : 'Results of poll:'}</Th>
                <Th>{poll.prompt}</Th>
                <Th>{parseTime(poll.timer.duration)}</Th>
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
                <Td><text style={{color: colors[poll.options.indexOf(o)]}}>■</text> {o.text}</Td>
                <Td>{o.voters.length}<Progress className={`quadrant${poll.options.indexOf(o)}`} value={getPercent(o, conversation)} /></Td>
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

  