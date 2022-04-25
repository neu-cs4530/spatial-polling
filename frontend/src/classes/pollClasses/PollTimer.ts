// TODO
export type ServerPollTimer = {
    duration: number;
    timer: ReturnType<typeof setInterval> | undefined;
  };

export default class PollTimer {
  maxTime: number;

  private _duration: number;

  timer: ReturnType<typeof setInterval> | undefined;

  isPaused: boolean;

  constructor (duration: number) {
      this.maxTime = duration;
      this._duration = duration;
      this.isPaused = false;
  }

  get duration() {
      return this._duration;
  }

  set duration(newDur: number) {
    this._duration = newDur;
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
      this.duration += seconds;
      this.maxTime += seconds;
  }

  /**
   * Pauses or unpauses timer
   */
  pauseTimer() {
      this.isPaused = !this.isPaused;
  }

  toServerPollTimer(): ServerPollTimer {
      return {
          duration: this.duration,
          timer: this.timer,
      };
    }
}