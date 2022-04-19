import BoundingBox from './BoundingBox';
import ConversationAreaPoll from './pollClasses/ConversationAreaPoll';

export type ServerConversationArea = {
  label: string;
  topic?: string;
  occupantsByID: string[];
  boundingBox: BoundingBox;
  activePoll?: ConversationAreaPoll;
};

export type ConversationAreaListener = {
  onTopicChange?: (newTopic: string | undefined) => void;
  onOccupantsChange?: (newOccupants: string[]) => void;
  onActivePollChange?: (newPoll: ConversationAreaPoll | undefined) => void;
};
export const NO_TOPIC_STRING = '(No topic)';
export default class ConversationArea {
  private _occupants: string[] = [];

  private _label: string;

  private _topic?: string;

  private _boundingBox: BoundingBox;

  private _listeners: ConversationAreaListener[] = [];

  private _activePoll?: ConversationAreaPoll;

  constructor(label: string, boundingBox: BoundingBox, topic?: string) {
    this._boundingBox = boundingBox;
    this._label = label;
    this._topic = topic;
  }

  get label() {
    return this._label;
  }

  set activePoll(newActivePoll: ConversationAreaPoll | undefined) {
    if(this._activePoll !== newActivePoll) {
      console.log('calling onActivePollChange for each listener...')
      this._listeners.forEach(listener => listener.onActivePollChange?.(newActivePoll));
    }
    this._activePoll = newActivePoll;
  }

  get activePoll() {
    return this._activePoll;
  }

  set occupants(newOccupants: string[]) {
    if(newOccupants.length !== this._occupants.length || !newOccupants.every((val, index) => val === this._occupants[index])){
      this._listeners.forEach(listener => listener.onOccupantsChange?.(newOccupants));
      this._occupants = newOccupants;
    }
  }

  get occupants() {
    return this._occupants;
  }

  set topic(newTopic: string | undefined) {
    if(this._topic !== newTopic){
      console.log('calling onTopicChange for each listener...')
      this._listeners.forEach(listener => listener.onTopicChange?.(newTopic));
    }
    this._topic = newTopic;
  }

  get topic() {
    return this._topic || NO_TOPIC_STRING;
  }

  isEmpty(): boolean {
    return this._topic === undefined;
  }

  getBoundingBox(): BoundingBox {
    return this._boundingBox;
  }

  toServerConversationArea(): ServerConversationArea {
    return {
      label: this.label,
      occupantsByID: this.occupants,
      topic: this.topic,
      boundingBox: this.getBoundingBox(),
      activePoll: this.activePoll,
    };
  }

  addListener(listener: ConversationAreaListener) {
    this._listeners.push(listener);
  }

  removeListener(listener: ConversationAreaListener) {
    this._listeners = this._listeners.filter(eachListener => eachListener !== listener);
  }

  copy() : ConversationArea{
    const ret = new ConversationArea(this.label,this._boundingBox,this.topic);
    ret.occupants = this.occupants.concat([]);
    this._listeners.forEach(listener => ret.addListener(listener));
    return ret;
  }

  static fromServerConversationArea(serverArea: ServerConversationArea): ConversationArea {
    const ret = new ConversationArea(serverArea.label, BoundingBox.fromStruct(serverArea.boundingBox), serverArea.topic);
    ret.occupants = serverArea.occupantsByID;
    return ret;
  }
}
