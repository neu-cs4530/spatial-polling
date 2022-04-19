import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { Socket } from 'socket.io';
import * as TestUtils from '../client/TestUtils';
import { GridSquare, ServerConversationArea, ServerPollOption } from '../client/TownsServiceClient';
import { UserLocation } from '../CoveyTypes';
import { townSubscriptionHandler } from '../requestHandlers/CoveyTownRequestHandlers';
import CoveyTownListener from '../types/CoveyTownListener';
import Player from '../types/Player';
import PlayerSession from '../types/PlayerSession';
import CoveyTownController from './CoveyTownController';
import CoveyTownsStore from './CoveyTownsStore';
import TwilioVideo from './TwilioVideo';

const mockTwilioVideo = mockDeep<TwilioVideo>();
jest.spyOn(TwilioVideo, 'getInstance').mockReturnValue(mockTwilioVideo);

function generateTestLocation(): UserLocation {
  return {
    rotation: 'back',
    moving: Math.random() < 0.5,
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  };
}

describe('CoveyTownController', () => {
  beforeEach(() => {
    mockTwilioVideo.getTokenForTown.mockClear();
  });
  it('constructor should set the friendlyName property', () => {
    const townName = `FriendlyNameTest-${nanoid()}`;
    const townController = new CoveyTownController(townName, false);
    expect(townController.friendlyName).toBe(townName);
  });
  describe('addPlayer', () => {
    it('should use the coveyTownID and player ID properties when requesting a video token', async () => {
      const townName = `FriendlyNameTest-${nanoid()}`;
      const townController = new CoveyTownController(townName, false);
      const newPlayerSession = await townController.addPlayer(new Player(nanoid()));
      expect(mockTwilioVideo.getTokenForTown).toBeCalledTimes(1);
      expect(mockTwilioVideo.getTokenForTown).toBeCalledWith(
        townController.coveyTownID,
        newPlayerSession.player.id,
      );
    });
  });
  describe('town listeners and events', () => {
    let testingTown: CoveyTownController;
    const mockListeners = [
      mock<CoveyTownListener>(),
      mock<CoveyTownListener>(),
      mock<CoveyTownListener>(),
    ];
    beforeEach(() => {
      const townName = `town listeners and events tests ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
      mockListeners.forEach(mockReset);
    });
    it('should notify added listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);
      const newLocation = generateTestLocation();
      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.updatePlayerLocation(player, newLocation);
      mockListeners.forEach(listener => expect(listener.onPlayerMoved).toBeCalledWith(player));
    });
    it('should notify added listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.destroySession(session);
      mockListeners.forEach(listener =>
        expect(listener.onPlayerDisconnected).toBeCalledWith(player),
      );
    });
    it('should notify added listeners of new players when addPlayer is called', async () => {
      mockListeners.forEach(listener => testingTown.addTownListener(listener));

      const player = new Player('test player');
      await testingTown.addPlayer(player);
      mockListeners.forEach(listener => expect(listener.onPlayerJoined).toBeCalledWith(player));
    });
    it('should notify added listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      testingTown.disconnectAllPlayers();
      mockListeners.forEach(listener => expect(listener.onTownDestroyed).toBeCalled());
    });
    it('should not notify removed listeners of player movement when updatePlayerLocation is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const newLocation = generateTestLocation();
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.updatePlayerLocation(player, newLocation);
      expect(listenerRemoved.onPlayerMoved).not.toBeCalled();
    });
    it('should not notify removed listeners of player disconnections when destroySession is called', async () => {
      const player = new Player('test player');
      const session = await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerDisconnected).not.toBeCalled();
    });
    it('should not notify removed listeners of new players when addPlayer is called', async () => {
      const player = new Player('test player');

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      const session = await testingTown.addPlayer(player);
      testingTown.destroySession(session);
      expect(listenerRemoved.onPlayerJoined).not.toBeCalled();
    });

    it('should not notify removed listeners that the town is destroyed when disconnectAllPlayers is called', async () => {
      const player = new Player('test player');
      await testingTown.addPlayer(player);

      mockListeners.forEach(listener => testingTown.addTownListener(listener));
      const listenerRemoved = mockListeners[1];
      testingTown.removeTownListener(listenerRemoved);
      testingTown.disconnectAllPlayers();
      expect(listenerRemoved.onTownDestroyed).not.toBeCalled();
    });
  });
  describe('townSubscriptionHandler', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let session: PlayerSession;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      session = await testingTown.addPlayer(player);
    });
    it('should reject connections with invalid town IDs by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(nanoid(), session.sessionToken, mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    it('should reject connections with invalid session tokens by calling disconnect', async () => {
      TestUtils.setSessionTokenAndTownID(testingTown.coveyTownID, nanoid(), mockSocket);
      townSubscriptionHandler(mockSocket);
      expect(mockSocket.disconnect).toBeCalledWith(true);
    });
    describe('with a valid session token', () => {
      it('should add a town listener, which should emit "newPlayer" to the socket when a player joins', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        await testingTown.addPlayer(player);
        expect(mockSocket.emit).toBeCalledWith('newPlayer', player);
      });
      it('should add a town listener, which should emit "playerMoved" to the socket when a player moves', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.updatePlayerLocation(player, generateTestLocation());
        expect(mockSocket.emit).toBeCalledWith('playerMoved', player);
      });
      it('should add a town listener, which should emit "playerDisconnect" to the socket when a player disconnects', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.destroySession(session);
        expect(mockSocket.emit).toBeCalledWith('playerDisconnect', player);
      });
      it('should add a town listener, which should emit "townClosing" to the socket and disconnect it when disconnectAllPlayers is called', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        testingTown.disconnectAllPlayers();
        expect(mockSocket.emit).toBeCalledWith('townClosing');
        expect(mockSocket.disconnect).toBeCalledWith(true);
      });
      describe('when a socket disconnect event is fired', () => {
        it('should remove the town listener for that socket, and stop sending events to it', async () => {
          TestUtils.setSessionTokenAndTownID(
            testingTown.coveyTownID,
            session.sessionToken,
            mockSocket,
          );
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            const newPlayer = new Player('should not be notified');
            await testingTown.addPlayer(newPlayer);
            expect(mockSocket.emit).not.toHaveBeenCalledWith('newPlayer', newPlayer);
          } else {
            fail('No disconnect handler registered');
          }
        });
        it('should destroy the session corresponding to that socket', async () => {
          TestUtils.setSessionTokenAndTownID(
            testingTown.coveyTownID,
            session.sessionToken,
            mockSocket,
          );
          townSubscriptionHandler(mockSocket);

          // find the 'disconnect' event handler for the socket, which should have been registered after the socket was connected
          const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect');
          if (disconnectHandler && disconnectHandler[1]) {
            disconnectHandler[1]();
            mockReset(mockSocket);
            TestUtils.setSessionTokenAndTownID(
              testingTown.coveyTownID,
              session.sessionToken,
              mockSocket,
            );
            townSubscriptionHandler(mockSocket);
            expect(mockSocket.disconnect).toHaveBeenCalledWith(true);
          } else {
            fail('No disconnect handler registered');
          }
        });
      });
      it('should forward playerMovement events from the socket to subscribed listeners', async () => {
        TestUtils.setSessionTokenAndTownID(
          testingTown.coveyTownID,
          session.sessionToken,
          mockSocket,
        );
        townSubscriptionHandler(mockSocket);
        const mockListener = mock<CoveyTownListener>();
        testingTown.addTownListener(mockListener);
        // find the 'playerMovement' event handler for the socket, which should have been registered after the socket was connected
        const playerMovementHandler = mockSocket.on.mock.calls.find(
          call => call[0] === 'playerMovement',
        );
        if (playerMovementHandler && playerMovementHandler[1]) {
          const newLocation = generateTestLocation();
          player.location = newLocation;
          playerMovementHandler[1](newLocation);
          expect(mockListener.onPlayerMoved).toHaveBeenCalledWith(player);
        } else {
          fail('No playerMovement handler registered');
        }
      });
    });
  });
  describe('addConversationArea', () => {
    let testingTown: CoveyTownController;
    beforeEach(() => {
      const townName = `addConversationArea test town ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
    });
    it('should add the conversation area to the list of conversation areas', () => {
      const newConversationArea = TestUtils.createConversationForTesting();
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      const areas = testingTown.conversationAreas;
      expect(areas.length).toEqual(1);
      expect(areas[0].label).toEqual(newConversationArea.label);
      expect(areas[0].topic).toEqual(newConversationArea.topic);
      expect(areas[0].boundingBox).toEqual(newConversationArea.boundingBox);
    });
  });
  describe('updatePlayerLocation', () => {
    let testingTown: CoveyTownController;
    beforeEach(() => {
      const townName = `updatePlayerLocation test town ${nanoid()}`;
      testingTown = new CoveyTownController(townName, false);
    });
    it("should respect the conversation area reported by the player userLocation.conversationLabel, and not override it based on the player's x,y location", async () => {
      const newConversationArea = TestUtils.createConversationForTesting({
        boundingBox: { x: 10, y: 10, height: 5, width: 5 },
      });
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      const player = new Player(nanoid());
      await testingTown.addPlayer(player);

      const newLocation: UserLocation = {
        moving: false,
        rotation: 'front',
        x: 25,
        y: 25,
        conversationLabel: newConversationArea.label,
      };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(player.activeConversationArea?.label).toEqual(newConversationArea.label);
      expect(player.activeConversationArea?.topic).toEqual(newConversationArea.topic);
      expect(player.activeConversationArea?.boundingBox).toEqual(newConversationArea.boundingBox);

      const areas = testingTown.conversationAreas;
      expect(areas[0].occupantsByID.length).toBe(1);
      expect(areas[0].occupantsByID[0]).toBe(player.id);
    });
    it('should emit an onConversationUpdated event when a conversation area gets a new occupant', async () => {
      const newConversationArea = TestUtils.createConversationForTesting({
        boundingBox: { x: 10, y: 10, height: 5, width: 5 },
      });
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);

      const mockListener = mock<CoveyTownListener>();
      testingTown.addTownListener(mockListener);

      const player = new Player(nanoid());
      await testingTown.addPlayer(player);
      const newLocation: UserLocation = {
        moving: false,
        rotation: 'front',
        x: 25,
        y: 25,
        conversationLabel: newConversationArea.label,
      };
      testingTown.updatePlayerLocation(player, newLocation);
      expect(mockListener.onConversationAreaUpdated).toHaveBeenCalledTimes(1);
    });
  });

  describe('ConversationAreaPoll', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let newConversationArea: ServerConversationArea;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      newConversationArea = TestUtils.createConversationForTesting({
        boundingBox: { height: 5, width: 5, x: 5, y: 5 },
      });
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      await testingTown.addPlayer(player);
    });
    it('must contain a prompt', () => {
      const wrongConversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: '',
        creator: player,
      });
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
      });

      // Ensures it doesn't set '.activePoll' to a ConversationAreaPoll without a prompt
      newConversationArea.activePoll = wrongConversationAreaPoll;
      expect(newConversationArea.activePoll).toBeUndefined();

      // Ensures it does set '.activePoll' to a valid ConversationAreaPoll
      newConversationArea.activePoll = conversationAreaPoll;
      expect(newConversationArea.activePoll).toEqual(conversationAreaPoll);
    });
    it('must have at least one pollOption', () => {
      const wrongConversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
        options: [],
      });

      // Ensures it doesn't set '.activePoll' to ConversationAreaPoll without a PollOption
      newConversationArea.activePoll = wrongConversationAreaPoll;
      expect(newConversationArea.activePoll).toBeUndefined();
    });
    it('it must not have more options than tiles in the area', () => {
      const wrongPollOption: ServerPollOption[] = [];
      const gridSquare: GridSquare = {
        box: { x1: 10, x2: 10, y1: 10, y2: 10 },
        height: 10,
        width: 10,
        x: 10,
        y: 10,
      };

      for (let i = 0; i < 500; i += 1) {
        wrongPollOption.push({ location: gridSquare, text: 'Grape', voters: [player.id] });
      }

      const wrongConversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
        options: wrongPollOption,
      });

      // Ensures it doesn't set '.activePoll' to a ConversationAreaPoll with more PollOptions than Tiles
      newConversationArea.activePoll = wrongConversationAreaPoll;
      expect(newConversationArea.activePoll).toBeUndefined();
    });
  });

  describe('addConversationPollHandler', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let newConversationArea: ServerConversationArea;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      newConversationArea = TestUtils.createConversationForTesting();
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      await testingTown.addPlayer(player);
    });
    it('ensures activePoll sets conversationAreaPoll to the conversationArea', async () => {
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
      });
      newConversationArea.activePoll = conversationAreaPoll;
      expect(newConversationArea.activePoll).toEqual(conversationAreaPoll);
    });
    it('ensures a conversationAreas active poll is updated to a new active poll and a server conversation at most one active poll at a time', async () => {
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
      });
      newConversationArea.activePoll = conversationAreaPoll;
      expect(newConversationArea.activePoll).toEqual(conversationAreaPoll);

      const conversationAreaPoll2 = TestUtils.createConversationPollForTesting({
        prompt: 'Best Soup',
        creator: player,
      });
      newConversationArea.activePoll = conversationAreaPoll2;
      expect(newConversationArea.activePoll).toEqual(conversationAreaPoll2);
    });
  });

  describe('PollOption', () => {
    const mockSocket = mock<Socket>();
    let testingTown: CoveyTownController;
    let player: Player;
    let newConversationArea: ServerConversationArea;
    beforeEach(async () => {
      const townName = `connectPlayerSocket tests ${nanoid()}`;
      testingTown = CoveyTownsStore.getInstance().createTown(townName, false);
      mockReset(mockSocket);
      player = new Player('test player');
      newConversationArea = TestUtils.createConversationForTesting();
      const result = testingTown.addConversationArea(newConversationArea);
      expect(result).toBe(true);
      await testingTown.addPlayer(player);
    });
    it('ensure text and location is defined', async () => {
      const gridSquare: GridSquare = {
        height: 100,
        width: 100,
        x: 400,
        y: 400,
        box: { x1: 100, x2: 100, y1: 400, y2: 400 },
      };
      const wrongConversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
        options: [
          {
            text: '',
            location: gridSquare,
            voters: [player.id],
          },
        ],
      });
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
        options: [{ location: gridSquare, text: 'Grape', voters: [player.id] }],
      });

      // Ensure it doens't set '.activePoll' to a ConversationArea with PollOptions that has undefined properties
      newConversationArea.activePoll = wrongConversationAreaPoll;
      expect(newConversationArea.activePoll).toBeUndefined();

      // Ensure it does set '.activePoll' to a ConversationArea with correct PollOption properties
      newConversationArea.activePoll = conversationAreaPoll;
      expect(newConversationArea.activePoll.options[0].text).toEqual('Grape');
      expect(newConversationArea.activePoll.options[0].location).toEqual({
        height: 100,
        width: 100,
        x: 400,
        y: 400,
        box: { x1: 100, x2: 100, y1: 400, y2: 400 },
      });
    });
    it('Ensure .addVoter works correctly', async () => {
      const player2 = new Player(nanoid());
     

      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
      });

      // Ensures 'PollOptions.addVoter' method works
      newConversationArea.activePoll = conversationAreaPoll;
      newConversationArea.activePoll.options[0].addVoter = player2.id;
      expect(newConversationArea.activePoll.options.length).toEqual(2);
      expect(newConversationArea.activePoll.options[1]).toEqual(player2.id);
    });
    it('Ensure there is >= 0 voters for a PollOption', async () => {
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
        options: [
          {
            location: {
              box: { x1: 10, x2: 10, y1: 10, y2: 10 },
              height: 10,
              width: 10,
              x: 10,
              y: 10,
            },
            text: 'Grape',
            voters: [],
          },
        ],
      });

      // Ensure it doesn't accept an empty array of Voters
      newConversationArea.activePoll = conversationAreaPoll;
      expect(newConversationArea.activePoll).toBeUndefined();
    });
    it("Ensure the same player can't be answered twice", async () => {
      const conversationAreaPoll = TestUtils.createConversationPollForTesting({
        prompt: 'Best Fruit',
        creator: player,
      });

      newConversationArea.activePoll = conversationAreaPoll;
      newConversationArea.activePoll.options[0].addVoter = player.id;
      expect(newConversationArea.activePoll.options[0].voters[0]).toEqual(player.id);
      expect(newConversationArea.activePoll.options[0].voters.length).toEqual(1);
    });
  });
});
