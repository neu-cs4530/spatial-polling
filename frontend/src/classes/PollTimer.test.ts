import { ScriptElementKindModifier, textSpanOverlap } from "typescript";
import PollTimer from "./PollTimer";


describe('A Conversation Area\'s Poll Timer ', () => {

    jest.spyOn(global, 'setInterval');
    
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.clearAllTimers();
        jest.useRealTimers();
    });
    it('should be initialized correctly', () => {
        const testPollTimer = new PollTimer(10);
        expect(testPollTimer.currentTime).toBe(10);
        expect(testPollTimer.maxTime).toBe(10);
        expect(testPollTimer.isPaused).toBeFalsy();
        expect(testPollTimer.timer).toBeUndefined();
    })
    it('should correctly count down every second', () => {
        const testPollTimer = new PollTimer(10);
        testPollTimer.startTimer();

        // Baseline. Nothing should have happened yet
        expect(testPollTimer.currentTime).toBe(10);

        jest.advanceTimersByTime(1000);

        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(testPollTimer.currentTime).toBe(9);
    });
    it('should be able to add a specified number of seconds to the timer', () => {
        const testPollTimer = new PollTimer(10);
        testPollTimer.startTimer();

        // Baseline. Nothing should have happened yet
        expect(testPollTimer.currentTime).toBe(10);

        testPollTimer.addTime(10);
        expect(setInterval).not.toHaveBeenCalled();
        expect(testPollTimer.currentTime).toBe(20);

        jest.advanceTimersByTime(1000);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(testPollTimer.currentTime).toBe(19);
        testPollTimer.addTime(10);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(testPollTimer.currentTime).toBe(29);
    });
    it('should be able to pause the timer if desired', () => {
        const testPollTimer = new PollTimer(10);
        testPollTimer.startTimer();

        // Baseline. Nothing should have happened yet
        expect(testPollTimer.currentTime).toBe(10);

        testPollTimer.pauseTimer();

        jest.advanceTimersByTime(1000);
        expect(setInterval).toHaveBeenCalledTimes(1);
        expect(testPollTimer.isPaused).toBeTruthy();
        expect(testPollTimer.currentTime).toBe(10);
    })

})