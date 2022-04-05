export default class PollTimer {

    maxTime: number;

    currentTime: number;

    timer: ReturnType<typeof setInterval> | undefined;

    isPaused: boolean;

    constructor (seconds: number) {
        this.maxTime = seconds;
        this.currentTime = seconds;
        this.isPaused = false;
    }

    /**
     * Basic timer structure for PollTimer class. Functionality will likely change
     * as project continues
     */
    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.currentTime = this.currentTime - 1;
            }
            if (this.currentTime === 0) {
                clearInterval(this.timer!);
                // additional functionality (ex. calling listeners, returns, etc to be added at a later date)
            }
        }, 1000);
    }

    /**
     * Allows adds a specified number of seconds to be added to a 
     * @param seconds 
     */
    addTime(seconds: number) {
        this.currentTime = this.currentTime + seconds;
        this.maxTime = this.maxTime + seconds;
    }

    /**
     * Pauses or unpauses timer
     */
    pauseTimer() {
        this.isPaused = !this.isPaused;
    }
}