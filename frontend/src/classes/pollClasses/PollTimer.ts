export type ServerPollTimer = {
    duration: number;
    timer: ReturnType<typeof setInterval> | undefined;
  };

/**
 * A ConversationAreaPoll's timer is represented by a PollTimer object
 */
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
   * While not paused, decrement the current duration by one until time runs out.
   */
  startTimer() {
      this.timer = setInterval(() => {
          if (!this.isPaused) {
              this.duration -= 1;
          }
          if (this.duration === 0 && this.timer) {
              clearInterval(this.timer);
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