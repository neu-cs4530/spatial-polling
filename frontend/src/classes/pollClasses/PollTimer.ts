export type ServerPollTimer = {
    duration: number;
    timer: ReturnType<typeof setInterval> | undefined;
  };

/**
 * The Poll Timer class is used to keep track of how much time is remaining in an active poll.
 * Its main and most important attribute, duration, represents the number of second left in the poll
 * and decrements in one second intervals using setInterval. Additional infrastructure to potentially
 * implement features like pausing and adding time is available, but not used in the current build.
 */
export default class PollTimer {
  maxTime: number;

  private _duration: number;

  timer: ReturnType<typeof setInterval> | undefined;

  isPaused: boolean;

  /**
   * Constructor for a poll timer.
   * @param duration The number of seconds this timer would count down for.
   */
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
   * Basic timer structure for PollTimer class. Once started, the time will decrease every second, like 
   * a regular stop watch.
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
   * Would allow a specified number of seconds to be added to a poll's duration
   * @param seconds the number of seconds to add
   */
  addTime(seconds: number) {
      this.duration += seconds;
      this.maxTime += seconds;
  }

  /**
   * Would pause or unpause timer
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