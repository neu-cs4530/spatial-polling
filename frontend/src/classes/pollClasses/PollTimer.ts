// TODO
export type ServerPollTimer = {
    duration: number;
  
    timer: ReturnType<typeof setInterval> | undefined;
  
    isPaused: boolean;
  };

export default class PollTimer {
  duration: number;

  timer: ReturnType<typeof setInterval> | undefined;

  isPaused: boolean;

  constructor (duration: number) {
      this.duration = duration;
      this.isPaused = false;
  }

  /**
   * Basic timer structure for PollTimer class. Functionality will likely change
   * as project continues
   */
  startTimer() {
      this.timer = setInterval(() => {
          if (!this.isPaused) {
              this.duration -= 1;
          }
          if (this.duration === 0 && this.timer) {
              clearInterval(this.timer);
              // additional functionality (ex. calling listeners, returns, etc to be added at a later date)
          }
      }, 1000);
  }

  /**
   * Allows adds a specified number of seconds to be added to a 
   * @param seconds 
   */
  addTime(seconds: number) {
      // Cap time at 599 seconds (9 minutes 59 seconds)
      // Let's not have some hooligan try to overflow the timer
      this.duration = Math.min(this.duration + seconds, 599);
  }

  /**
   * Pauses or unpauses timer
   */
  pauseTimer() {
      this.isPaused = !this.isPaused;
  }

}