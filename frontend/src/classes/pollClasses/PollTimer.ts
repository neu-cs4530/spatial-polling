// TODO
export type ServerPollTimer = {
    maxTime: number;
  
    duration: number;
  
    timer: ReturnType<typeof setInterval> | undefined;
  
    isPaused: boolean;
  };

export default class PollTimer {
  maxTime: number;

  duration: number;

  timer: ReturnType<typeof setInterval> | undefined;

  isPaused: boolean;

  constructor (duration: number) {
      this.maxTime = duration;
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
              console.log('duration decremented');
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
      this.duration += seconds;
      this.maxTime += seconds;
  }

  /**
   * Pauses or unpauses timer
   */
  pauseTimer() {
      this.isPaused = !this.isPaused;
  }

}