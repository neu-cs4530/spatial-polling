import { ScriptElementKindModifier, textSpanOverlap } from "typescript";
import PollTimer from "./PollTimer";


describe('A Conversation Area\'s Poll Timer ', () => {

    jest.spyOn(global, 'setInterval');
    
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should correctly increment every second', () => {
        const testPollTimer = new PollTimer(10);
        testPollTimer.startTimer();

        
    })

})